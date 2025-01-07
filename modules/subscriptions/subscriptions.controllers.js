const { Op } = require("sequelize");
const { Subscription } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");

const findSubscriptionByID = async (id) => {
  try {
    const subscription = await Subscription.findOne({
      where: {
        id,
      },
    });
    return subscription;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addSubscription = async (req, res) => {
  try {
    let {
      title,
      hint,
      percentSaved,
      freeDays,
      originalPrice,
      price,
      duration,
    } = req.body;
    const response = await Subscription.create({
      title,
      hint,
      percentSaved,
      freeDays,
      originalPrice,
      price,
      duration,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getSubscriptions = async (req, res) => {
  try {
    const response = await Subscription.findAndCountAll({
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

const getSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await findSubscriptionByID(id);
    successResponse(res, subscription);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await findSubscriptionByID(id);
    const response = await subscription.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await findSubscriptionByID(id);
    const response = await subscription.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findSubscriptionByID,
  getSubscriptions,
  addSubscription,
  deleteSubscription,
  addSubscription,
  getSubscription,
  updateSubscription,
};
