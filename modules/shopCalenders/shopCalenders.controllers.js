const { Op } = require("sequelize");
const { ShopCalender } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");
const shopcalender = require("../../models/shopcalender");

const findShopCalenderByID = async (id) => {
  try {
    const shopcalender = await ShopCalender.findOne({
      where: {
        id,
      },
    });
    return shopcalender;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addShopCalender = async (req, res) => {
  try {
    
    let { ShopId, day, openTime, closeTime, isOpen } = req.body;
    let shopCalender = await ShopCalender.findOne({
      where:{
        day,ShopId
      }
    })

    if(!shopCalender){
      shopcalender = await ShopCalender.create({
        ShopId,
        openTime,
        day,
        closeTime,
        isOpen,
      });
    }else{
      await shopCalender.update(req.body)
    }
    
    successResponse(res, shopCalender);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getShopCalenders = async (req, res) => {
  try {
    const response = await ShopCalender.findAndCountAll({
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

const getShopCalender = async (req, res) => {
  try {
    const { id } = req.params;
    const shopcalender = await findShopCalenderByID(id);
    successResponse(res, shopcalender);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateShopCalender = async (req, res) => {
  try {
    const { id } = req.params;
    const shopcalender = await findShopCalenderByID(id);
    const response = await shopcalender.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteShopCalender = async (req, res) => {
  try {
    const { id } = req.params;
    const shopcalender = await findShopCalenderByID(id);
    const response = await shopcalender.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findShopCalenderByID,
  getShopCalenders,
  addShopCalender,
  deleteShopCalender,
  addShopCalender,
  getShopCalender,
  updateShopCalender,
};
