const { Op } = require("sequelize");
const { Message, Topic, Chat } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");

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
    const savedMessage = await Message.create({
      TopicId,
      UserId,
      from,
      message,
      imageUrl,
      type,
    });
    req.io.emit("receiveMessage", savedMessage);
    successResponse(res, savedMessage);
  } catch (error) {
    console.log(error);
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
