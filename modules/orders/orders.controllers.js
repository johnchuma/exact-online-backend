const { Op } = require("sequelize");
const { Shop, User, OrderedProduct } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");
const { getUserChats } = require("../chats/chats.controllers");

const findOrderByID = async (id) => {
  try {
    const reel = await Order.findOne({
      where: {
        id,
      },
      include: [Shop, User, OrderedProduct],
    });
    return reel;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addOrder = async (req, res) => {
  try {
    let { UserId, ShopId } = req.body;
    const response = await Order.create({
      UserId,
      ShopId,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getOrders = async (req, res) => {
  try {
    const response = await Order.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      include: [User, Shop],
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
const getUserOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Order.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        UserId: id,
      },
      include: [Shop],
    });
  } catch (e) {}
};
const getShopOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Order.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        ShopId: id,
      },
      include: [User],
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
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await findOrderByID(id);
    successResponse(res, reel);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await findOrderByID(id);
    const response = await reel.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await findOrderByID(id);
    const response = await reel.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findOrderByID,
  getOrders,
  addOrder,
  deleteOrder,
  getShopOrders,
  getUserOrders,
  addOrder,
  getOrder,
  updateOrder,
};
