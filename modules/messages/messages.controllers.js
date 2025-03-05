const { Op } = require("sequelize");
const { Message } = require("../../models");
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
  getMessage,
  updateMessage,
};
