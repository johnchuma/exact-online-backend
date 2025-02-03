const { Op } = require("sequelize");
const { Chat,Shop,User } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");

const findChatByID = async (id) => {
  try {
    const chat = await Chat.findOne({
      where: {
        id,
      },
    });
    return chat;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addChat = async (req, res) => {
  try {
    let { ShopId, UserId } = req.body;
    let chat  = await Chat.findOne({
      where:{
        ShopId,
        UserId,
      },
      include:[Shop,User]
    })
    if(!chat){
      chat =  await Chat.create({
        ShopId,
        UserId,
      });
    }
    successResponse(res, chat);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getChats = async (req, res) => {
  try {
    const response = await Chat.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
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
const getUserChats = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Chat.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        UserId: id,
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
const getShopChats = async (req, res) => {
  try {
    const { id } = req.body;
    const response = await Chat.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        ShopId: id,
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
const getChat = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await findChatByID(id);
    successResponse(res, chat);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateChat = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await findChatByID(id);
    const response = await chat.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteChat = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await findChatByID(id);
    const response = await chat.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findChatByID,
  getChats,
  addChat,
  getUserChats,
  getShopChats,
  deleteChat,
  addChat,
  getChat,
  updateChat,
};
