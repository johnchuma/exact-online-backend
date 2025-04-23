const { Op } = require("sequelize");
const { ShopFollower } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { findUserByID } = require("../users/users.controllers");

const findShopFollowerByID = async (id) => {
  try {
    const shopview = await ShopFollower.findOne({
      where: {
        id,
      },
    });
    return shopview;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addShopFollower = async (req, res) => {
  try {
    let { ShopId, UserId } = req.body;
    const response = await ShopFollower.create({
      ShopId,
      UserId,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getShopFollowers = async (req, res) => {
  try {
    const response = await ShopFollower.findAndCountAll({
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

const getShopFollower = async (req, res) => {
  try {
    const { id } = req.params;
    const shopview = await findShopFollowerByID(id);
    successResponse(res, shopview);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateShopFollower = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await shopview.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteShopFollower = async (req, res) => {
  try {
    const { id } = req.params;
    const shopview = await findShopFollowerByID(id);
    const response = await shopview.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findShopFollowerByID,
  getShopFollowers,
  addShopFollower,
  deleteShopFollower,
  addShopFollower,
  getShopFollower,
  updateShopFollower,
};
