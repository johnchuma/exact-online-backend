const { Op } = require("sequelize");
const { Message,Notification, Topic, Chat, User, Shop } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");
const { sendFCMNotification } = require("../../utils/send_notification");

const findMessageByID = async (id) => {
  try {
    const message = await Message.findOne({
      where: {
        id,
      },
    });
    return message;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addMessage = async (req, res) => {
  try {
    let { TopicId, UserId, from, message, imageUrl, type } = req.body;

    // Validate required fields
    if (!TopicId || !UserId || !from || !message) {
      return errorResponse(
        res,
        new Error(
          "Missing required fields: TopicId, UserId, from, and message are required"
        )
      );
    }

    const savedMessage = await Message.create({
      TopicId,
      UserId,
      from,
      message,
      imageUrl,
      type,
    });

    // Find the topic with the correct TopicId
    const topic = await Topic.findOne({
      where: { id: TopicId },
      include: [
        {
          model: Chat,
          include: [User, { model: Shop, include: [User] }],
        },
      ],
    });

    if (req.io) {
      req.io.emit("receiveMessage", savedMessage);
    }

    // Send FCM notifications only if we have the topic and valid tokens
    if (topic && topic.Chat) {
      try {
        if (from == "user" && topic.Chat.Shop.User.token) {
          await sendFCMNotification({
            title: `${topic.Chat.User.name}`,
            body: message,
            token: topic.Chat.Shop.User.token,
            data: {
              type: "message",
              topicId: String(TopicId),
              to: "shop",
              chatId: String(topic.Chat.id),
            },
          });
          await Notification.create({
            title: `New message from ${topic.Chat.User.name}`,
            message: message,
            userId: topic.Chat.Shop.User.id,
          });

        } else if (from == "shop" && topic.Chat.User.token) {
          await sendFCMNotification({
            title: `${topic.Chat.Shop.name}`,
            body: message,
            token: topic.Chat.User.token,
            data: {
              type: "message",
              topicId: String(TopicId),
              to: "user",
              chatId: String(topic.Chat.id),
            },
          });
          await Notification.create({
            title: `New message from ${topic.Chat.Shop.name}`,
            message: message,
            userId: topic.Chat.User.id,
          });
        }
      } catch (notificationError) {
        console.log("FCM notification failed:", notificationError);
        // Don't fail the message sending if notification fails
      }
    }

    successResponse(res, savedMessage);
  } catch (error) {
    console.log("Error in addMessage:", error);
    errorResponse(res, error);
  }
};
const getTopicMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Message.findAll({
      order: [["createdAt"]],
      where: {
        TopicId: id,
      },
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await findMessageByID(id);
    successResponse(res, message);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await findMessageByID(id);

    const response = await message.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const markAsReadShopMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { ChatId } = req.query;
    console.log("marking shop messages as read");

    // Find messages with the required associations
    const messages = await Message.findAll({
      include: [
        {
          model: Topic,
          include: [
            {
              model: Chat,
              where: { ShopId: id, id: ChatId },
              required: true,
            },
          ],
          required: true,
        },
      ],
    });

    if (messages.length === 0) {
      return res
        .status(404)
        .json({ message: "No messages found for this shop." });
    }

    // Update messages after finding them
    await Message.update(
      { delivered: true },
      {
        where: {
          id: messages.map((msg) => msg.id), // Update only found message IDs
        },
      }
    );

    successResponse(res, { message: "Messages marked as read." });
  } catch (error) {
    console.error("Error updating messages:", error);
    errorResponse(res, error);
  }
};

const markAsReadUserMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { ChatId } = req.query;

    console.log("marking user messages as read");
    // Find messages related to the user
    const messages = await Message.findAll({
      include: [
        {
          model: Topic,
          include: [
            {
              model: Chat,
              where: { UserId: id, id: ChatId },
              required: true,
            },
          ],
          required: true,
        },
      ],
    });

    if (messages.length === 0) {
      return res
        .status(404)
        .json({ message: "No messages found for this user." });
    }

    // Extract message IDs and update them
    await Message.update(
      { delivered: true },
      {
        where: {
          id: messages.map((msg) => msg.id), // Only update found messages
        },
      }
    );

    successResponse(res, { message: "Messages marked as read." });
  } catch (error) {
    console.error("Error updating messages:", error);
    errorResponse(res, error);
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await findMessageByID(id);
    const response = await message.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findMessageByID,
  addMessage,
  deleteMessage,
  getTopicMessages,
  addMessage,
  markAsReadShopMessage,
  markAsReadUserMessage,
  getMessage,
  updateMessage,
};
