const { Op } = require("sequelize");
const { Shop, User, OrderedProduct, Order, Product } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");
const { getUserChats } = require("../chats/chats.controllers");
const sendSMS = require("../../utils/send_sms");
const logger = require("../../utils/logger");
const { v4: uuidv4 } = require("uuid"); // For requestId

const childLogger = logger.child({ module: "Orders Module" });

const findOrderByID = async (id) => {
  const requestId = uuidv4();
  try {
    childLogger.info("Finding order by ID", { requestId, orderId: id });
    const order = await Order.findOne({
      where: { id },
      include: [User, OrderedProduct],
    });
    if (!order) {
      childLogger.warn("Order not found", { requestId, orderId: id });
    } else {
      childLogger.info("Order found", { requestId, orderId: id });
    }
    return order;
  } catch (error) {
    childLogger.error("Failed to find order", {
      requestId,
      orderId: id,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

const addOrder = async (req, res) => {
  const requestId = uuidv4();
  try {
    childLogger.http("Received add order request", {
      requestId,
      method: req.method,
      url: req.url,
      body: req.body,
    });

    const { ShopId, UserId, status, totalPrice } = req.body;
    childLogger.debug("Request body", { requestId, body: req.body });

    childLogger.info("Creating new order", { requestId, ShopId, UserId, status, totalPrice });
    const response = await Order.create({
      ShopId,
      UserId,
      status,
      totalPrice,
    });

    childLogger.info("Fetching shop details", { requestId, ShopId });
    const shop = await Shop.findOne({
      where: { id: ShopId },
      include: [User],
    });

    childLogger.info("Fetching user details", { requestId, UserId });
    const from = await User.findOne({
      where: { id: UserId },
    });

    childLogger.info("Sending SMS to shop", { requestId, shopId: ShopId, userId: UserId });
    await sendSMS(
      shop.phone,
      `Dear ${shop.User.name},\nYou have a new order in your shop (${shop.name}) from ${from.name}. Open the app to view it.\n\nThank you.`
    );

    childLogger.info("Order added successfully", {
      requestId,
      orderId: response.id,
      ShopId,
      UserId,
      status,
    });

    successResponse(res, response);
  } catch (error) {
    childLogger.error("Failed to create order", {
      requestId,
      ShopId: req.body.ShopId,
      UserId: req.body.UserId,
      error: error.message,
      stack: error.stack,
    });
    errorResponse(res, error);
  }
};

const getOrders = async (req, res) => {
  const requestId = uuidv4();
  try {
    childLogger.http("Received get orders request", {
      requestId,
      method: req.method,
      url: req.url,
      query: { limit: req.limit, offset: req.offset },
    });

    childLogger.info("Fetching all orders", {
      requestId,
      limit: req.limit,
      offset: req.offset,
    });
    const response = await Order.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      include: [User, Shop],
    });

    childLogger.info("Orders fetched successfully", {
      requestId,
      count: response.count,
      page: req.page,
    });
    successResponse(res, {
      count: response.count,
      page: req.page,
      ...response,
    });
  } catch (error) {
    childLogger.error("Failed to fetch orders", {
      requestId,
      limit: req.limit,
      offset: req.offset,
      error: error.message,
      stack: error.stack,
    });
    errorResponse(res, error);
  }
};

const getUserOrders = async (req, res) => {
  const requestId = uuidv4();
  try {
    const { id } = req.params;
    const { status } = req.query;
    childLogger.http("Received get user orders request", {
      requestId,
      method: req.method,
      url: req.url,
      params: { id },
      query: { status },
    });

    childLogger.info("Fetching user orders", {
      requestId,
      userId: id,
      status: status || "NEGOTIATION",
      limit: req.limit,
      offset: req.offset,
    });
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
        { model: User },
        { model: Shop },
      ],
    });

    childLogger.info("User orders fetched successfully", {
      requestId,
      userId: id,
      count: response.count,
      page: req.page,
    });
    successResponse(res, {
      count: response.count,
      page: req.page,
      ...response,
    });
  } catch (error) {
    childLogger.error("Failed to fetch user orders", {
      requestId,
      userId: req.params.id,
      status: req.query.status || "NEGOTIATION",
      limit: req.limit,
      offset: req.offset,
      error: error.message,
      stack: error.stack,
    });
    errorResponse(res, error);
  }
};

const getShopOrders = async (req, res) => {
  const requestId = uuidv4();
  try {
    const { id } = req.params;
    const { status } = req.query;
    childLogger.http("Received get shop orders request", {
      requestId,
      method: req.method,
      url: req.url,
      params: { id },
      query: { status },
    });

    childLogger.info("Fetching shop orders", {
      requestId,
      shopId: id,
      status: status || "NEGOTIATION",
      limit: req.limit,
      offset: req.offset,
    });
    const response = await Order.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      order: [["updatedAt", "DESC"]],
      where: {
        status: status ||  "NEGOTIATION"
      },
      include: [
        {
          model: OrderedProduct,
          include: [
            {
              model: Product,
              where: { ShopId: id },
              include: [Shop],
              required: true,
            },
          ],
        },
        User,
      ],
    });

    childLogger.info("Shop orders fetched successfully", {
      requestId,
      shopId: id,
      count: response.count,
      page: req.page,
    });
    successResponse(res, {
      count: response.count,
      page: req.page,
      ...response,
    });
  } catch (error) {
    childLogger.error("Failed to fetch shop orders", {
      requestId,
      shopId: req.params.id,
      status: req.query.status || "NEGOTIATION",
      limit: req.limit,
      offset: req.offset,
      error: error.message,
      stack: error.stack,
    });
    errorResponse(res, error);
  }
};

const getOrder = async (req, res) => {
  const requestId = uuidv4();
  try {
    const { id } = req.params;
    childLogger.http("Received get order request", {
      requestId,
      method: req.method,
      url: req.url,
      params: { id },
    });

    childLogger.info("Fetching order", { requestId, orderId: id });
    const order = await findOrderByID(id);

    if (!order) {
      childLogger.warn("Order not found", { requestId, orderId: id });
      return res.status(404).send({
        status: false,
        message: "Order not found",
      });
    }

    childLogger.info("Order fetched successfully", { requestId, orderId: id });
    successResponse(res, order);
  } catch (error) {
    childLogger.error("Failed to fetch order", {
      requestId,
      orderId: req.params.id,
      error: error.message,
      stack: error.stack,
    });
    errorResponse(res, error);
  }
};

const updateOrder = async (req, res) => {
  const requestId = uuidv4();
  try {
    const { id } = req.params;
    childLogger.http("Received update order request", {
      requestId,
      method: req.method,
      url: req.url,
      params: { id },
      body: req.body,
    });

    childLogger.debug("Request body", { requestId, body: req.body });

    childLogger.info("Fetching order for update", { requestId, orderId: id });
    const order = await findOrderByID(id);

    if (!order) {
      childLogger.warn("Order not found", { requestId, orderId: id });
      return res.status(404).send({
        status: false,
        message: "Order not found",
      });
    }

    childLogger.info("Updating order", { requestId, orderId: id });
    const response = await order.update({
      ...req.body,
    });

    childLogger.info("Order updated successfully", { requestId, orderId: id });
    successResponse(res, response);
  } catch (error) {
    childLogger.error("Failed to update order", {
      requestId,
      orderId: req.params.id,
      error: error.message,
      stack: error.stack,
    });
    errorResponse(res, error);
  }
};

const deleteOrder = async (req, res) => {
  const requestId = uuidv4();
  try {
    const { id } = req.params;
    childLogger.http("Received delete order request", {
      requestId,
      method: req.method,
      url: req.url,
      params: { id },
    });

    childLogger.info("Fetching order for deletion", { requestId, orderId: id });
    const order = await findOrderByID(id);

    if (!order) {
      childLogger.warn("Order not found", { requestId, orderId: id });
      return res.status(404).send({
        status: false,
        message: "Order not found",
      });
    }

    childLogger.info("Deleting order", { requestId, orderId: id });
    const response = await order.destroy();

    childLogger.info("Order deleted successfully", { requestId, orderId: id });
    successResponse(res, response);
  } catch (error) {
    childLogger.error("Failed to delete order", {
      requestId,
      orderId: req.params.id,
      error: error.message,
      stack: error.stack,
    });
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
  getOrder,
  updateOrder,
};