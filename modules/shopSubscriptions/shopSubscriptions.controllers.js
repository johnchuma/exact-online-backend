const { Op } = require("sequelize");
const { ShopSubscription } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");
const { findSubscriptionByID } = require("../subscriptions/subscriptions.controllers");

const findShopSubscriptionByID = async (id) => {
  try {
    const shopsubscription = await ShopSubscription.findOne({
      where: {
        id,
      },
    });
    return shopsubscription;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addShopSubscription = async (req, res) => {
  try {
    let { SubscriptionId, ShopId } = req.body;
    const subscription  =await findSubscriptionByID(SubscriptionId)
    const response = await ShopSubscription.create({
      ShopId,
      SubscriptionId,
      expireDate:moment(Date.now()).add(subscription.days,"days")
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getShopSubscriptions = async (req, res) => {
  try {
    const response = await ShopSubscription.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
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

const getShopSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const shopsubscription = await findShopSubscriptionByID(id);
    successResponse(res, shopsubscription);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateShopSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const shopsubscription = await findShopSubscriptionByID(id);
    const response = await shopsubscription.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteShopSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const shopsubscription = await findShopSubscriptionByID(id);
    const response = await shopsubscription.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findShopSubscriptionByID,
  getShopSubscriptions,
  addShopSubscription,
  deleteShopSubscription,
  addShopSubscription,
  getShopSubscription,
  updateShopSubscription,
};
