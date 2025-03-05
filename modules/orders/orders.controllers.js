const { Op } = require("sequelize");
const { Shop, User, OrderedProduct,Order,Product } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");
const { getUserChats } = require("../chats/chats.controllers");

const findOrderByID = async (id) => {
  try {
    const order = await Order.findOne({
      where: {
        id,
      },
      include: [User, OrderedProduct],
    });
    return order;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addOrder = async (req, res) => {
  try {
    const {ShopId,UserId} = req.body;
    const response = await Order.create({
       ShopId,UserId
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
      order:[["updatedAt","DESC"]],
      where: {
        UserId: id,
        
      },
      include: [
        {
          model: OrderedProduct,
          include: [
            {
              required:true,
              model: Product,
              include: [Shop],
            },
          ],
        },
        {
          model: User,
        },
        {
          model: Shop,
        },
      ],
    });
    successResponse(res, {
      count: response.count,
      page: req.page,
      ...response,
    });
  } catch (e) {
    errorResponse(res, e); // Pass the error object directly
  }
};
const getShopOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Order.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      order:[["updatedAt","DESC"]],
     
      include: [{
        model:OrderedProduct,
        include:[{
          model:Product,
          where:{
            ShopId:id
          },
          include:[Shop],
          required:true
        }]
      },User],
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
    const order = await findOrderByID(id);
    successResponse(res, order);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await findOrderByID(id);
    const response = await order.update({
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
    const order = await findOrderByID(id);
    const response = await order.destroy();
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
