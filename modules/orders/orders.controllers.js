const { Op } = require("sequelize");
const {
  Shop,
  User,
  OrderedProduct,
  Order,
  Product,
  ProductImage,
} = require("../../models");
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
      include: [
        User,
        { model: Shop, include: [User] },
        {
          model: OrderedProduct,
          include: [
            {
              model: Product,
              include: [ProductImage],
            },
          ],
        },
      ],
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
      data: { type: "order", orderId: String(response.id), to: "shop" },
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
    let { status } = req.query;
    console.log(status);

    if (status == "DELIVERED") {
      status = ["DELIVERED", "CLOSED"];
    } else if (status == "NEW ORDER") {
      status = ["NEW ORDER", "IN PROGRESS", "CONFIRMED", "DELIVERED", "CLOSED"];
    } else {
      status = [status];
    }
    const response = await Order.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      order: [["updatedAt", "DESC"]],
      where: {
        UserId: id,
        status: {
          [Op.in]: status,
        },
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
          required: true,
        },
        {
          model: Shop,
          required: true,
        },
      ],
    });
    successResponse(res, {
      count: response.count,
      page: req.page,
      ...response,
    });
  } catch (e) {
    console.log(e);
    errorResponse(res, e); // Pass the error object directly
  }
};
const getShopOrders = async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.query;
    if (status == "DELIVERED") {
      status = ["DELIVERED", "CLOSED"];
    } else {
      status = [status];
    }
    const response = await Order.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      order: [["updatedAt", "DESC"]],
      where: {
        status: {
          [Op.in]: status,
        },
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
    console.log(error);
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
    const user = await User.findOne({
      where: {
        id: req.user.id,
      },
    });

    const payload = req.body;
    const order = await findOrderByID(id);
    if (payload.status == "IN PROGRESS") {
      await sendFCMNotification({
        title: `${order.User.name} confirmed the price`,
        body: `${order.User.name} has just confirmed the price after negotiation`,
        token: order.Shop.User.token,
        data: { type: "order", orderId: String(order.id), to: "shop" },
      });
    }
    if (payload.status == "CONFIRMED") {
      await sendFCMNotification({
        title: `Seller has confirmed the order`,
        body: `${order.Shop.name} seller has just confirmed your order`,
        token: order.User.token,
        data: { type: "order", orderId: String(order.id), to: "user" },
      });
    }
    if (payload.status == "CANCELED") {
      await sendFCMNotification({
        title: `Order cancellation`,
        body: `${user.name} has just canceled an order`,
        token: user.token,
        data: { type: "order", orderId: String(order.id), to: "shop" },
      });
    }
    if (payload.status == "DELIVERED") {
      await sendFCMNotification({
        title: `Order is delivered successfully`,
        body: `Your order is marked as delivered`,
        token: order.User.token,
        data: { type: "order", orderId: String(order.id), to: "user" },
      });
    }
    if (payload.status == "CLOSED") {
      await sendFCMNotification({
        title: `Customer confirmed delivery`,
        body: `Customer has just confirmed that they got their order`,
        token: order.Shop.User.token,
        data: { type: "order", orderId: String(order.id), to: "shop" },
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
