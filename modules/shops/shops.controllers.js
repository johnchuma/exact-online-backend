const { Op } = require("sequelize");
const {
  Shop,
  ShopCalender,
  ShopSubscription,
  ShopDocument,
  ShopView,
} = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");

const findShopByID = async (id) => {
  try {
    const shop = await Shop.findOne({
      where: {
        id,
      },
      include: [ShopCalender, ShopSubscription, ShopView],
    });
    return shop;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addShop = async (req, res) => {
  try {
    let { registeredBy, name, phone, address, description, UserId } = req.body;
    console.log(req.body);
    const response = await Shop.create({
      registeredBy,
      name,
      phone,
      address,
      description,
      UserId: UserId,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getShops = async (req, res) => {
  try {
    const response = await Shop.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
      },
      include: [ShopDocument],
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

const getUserShops = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Shop.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
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

const getShop = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await findShopByID(id);
    successResponse(res, shop);
  } catch (error) {
    errorResponse(res, error);
  }
};

const updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, req.body);
    const shop = await findShopByID(id);
    const response = await shop.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteShop = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await findShopByID(id);
    const response = await shop.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findShopByID,
  getShops,
  addShop,
  deleteShop,
  addShop,
  getShop,
  getUserShops,
  updateShop,
};
