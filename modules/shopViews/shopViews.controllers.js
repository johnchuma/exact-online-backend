const { Op } = require("sequelize");
const { ShopView } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");

const findShopViewByID = async (id) => {
  try {
    const shopview = await ShopView.findOne({
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
const addShopView = async (req, res) => {
  try {
    let { shopId, userId } = req.body;
    const response = await ShopView.create({
      shopId,
      userId,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getShopViews = async (req, res) => {
  try {
    const response = await ShopView.findAndCountAll({
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

const getShopView = async (req, res) => {
  try {
    const { id } = req.params;
    const shopview = await findShopViewByID(id);
    successResponse(res, shopview);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateShopView = async (req, res) => {
  try {
    const { id } = req.params;
    const shopview = await findShopViewByID(id);
    const response = await shopview.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteShopView = async (req, res) => {
  try {
    const { id } = req.params;
    const shopview = await findShopViewByID(id);
    const response = await shopview.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findShopViewByID,
  getShopViews,
  addShopView,
  deleteShopView,
  addShopView,
  getShopView,
  updateShopView,
};
