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
    let { chatId, userId, shopId, message } = req.body;
    const image = await getUrl(req);
    const response = await Message.create({
      chatId,
      userId,
      shopId,
      message,
      image,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getMessages = async (req, res) => {
  try {
    const response = await Message.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        title: {
          [Op.like]: `%${req.keyword}%`,
        },
      },
    });
    successResponse(res, {
      count: response.count,
      page: req.page,
      ...response,
    });
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
  getMessages,
  addMessage,
  deleteMessage,
  addMessage,
  getMessage,
  updateMessage,
};
