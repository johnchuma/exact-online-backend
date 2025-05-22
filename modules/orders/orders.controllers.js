const { Op } = require("sequelize");
const { Shop, User, OrderedProduct, Order, Product } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");
const { getUserChats } = require("../chats/chats.controllers");
const sendSMS = require("../../utils/send_sms");
const { sendFCMNotification } = require("../../utils/send_notification");

const findOrderByID = async (id) => {
  try {
    const order = await Order.findOne({
      where: {
        id,
      },
      include: [User, { model: Shop, include: [User] }, OrderedProduct],
    });
    return order;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addOrder = async (req, res) => {
  try {
    const { ShopId, UserId, status, totalPrice } = req.body;

    const response = await Order.create({
      ShopId,
      UserId,
      status,
      totalPrice,
    });
    const shop = await Shop.findOne({
      where: {
        id: ShopId,
      },
      include: [User],
    });
    const from = await User.findOne({
      where: {
        id: UserId,
      },
    });
    await sendFCMNotification({
      title: "You have a new order",
      body: `${from.name} has just placed an order.`,
      token: shop.User.token,
    });
    await sendSMS(
      shop.phone,
      `Dear ${shop.User.name},\nYou have a new order in your shop, ${shop.name} from ${from.name}. Open the app to view it.\n\nThank you.`
    );

    console.log(response);
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
    const { status } = req.query;
    const response = await Order.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      order: [["updatedAt", "DESC"]],
      where: {
        UserId: id,
        status: status || "NEGOTIATION",
      },
      include: [
        {
          model: OrderedProduct,
          include: [
            {
              required: true,
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
    const { status } = req.query;
    const response = await Order.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      order: [["updatedAt", "DESC"]],
      where: {
        status: status || "NEGOTIATION",
      },
      include: [
        {
          model: OrderedProduct,
          include: [
            {
              model: Product,
              where: {
                ShopId: id,
              },
              include: [Shop],
              required: true,
            },
          ],
        },
        User,
      ],
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
    const payload = req.body;
    const order = await findOrderByID(id);
    if (payload.status == "IN PROGRESS") {
      await sendFCMNotification({
        title: `${order.User.name} confirmed the price`,
        body: `${order.User.name} has just confirmed the price after negotiation`,
        token: order.Shop.User.token,
      });
    }
    if (payload.status == "CONFIRMED") {
      await sendFCMNotification({
        title: `Seller has confirmed the order`,
        body: `${order.Shop.name} seller has just confirmed your order`,
        token: order.User.token,
      });
    }
    if (payload.status == "CANCELED") {
      await sendFCMNotification({
        title: `Seller has confirmed the order`,
        body: `${order.Shop.name} seller has just canceled your order`,
        token: order.User.token,
      });
    }
    const response = await order.update(payload);
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
