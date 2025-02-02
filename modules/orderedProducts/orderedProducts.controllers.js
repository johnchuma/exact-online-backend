const { Op } = require("sequelize");
const { OrderedProduct, User,Product,Order,ProductImage, ProductStat, ProductReview,Shop } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");

const findOrderedProductByID = async (id) => {
  try {
    const reel = await OrderedProduct.findOne({
      where: {
        id,
      },
    });
    return reel;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addOrderedProduct = async (req, res) => {
  try {
    let { OrderId, ProductId } = req.body;
    const response = await OrderedProduct.create({
      OrderId,
      ProductId,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getOrderedProducts = async (req, res) => {
  try {
    const response = await OrderedProduct.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
    
      include: [Shop],
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
const findOnCartOrderedProducts = async (req, res) => {
  try {
    const response = await OrderedProduct.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      include:[{
        model:Order,
        where:{
          status:"ON CART",
          UserId:req.user.id
        },
        required:true
      },{
        model:Product,
        include: [ProductImage, ProductStat, ProductReview,Shop],
      }],
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
const getOrderedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await findOrderedProductByID(id);
    successResponse(res, reel);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateOrderedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await findOrderedProductByID(id);
    const response = await reel.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteOrderedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await findOrderedProductByID(id);
    const response = await reel.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findOrderedProductByID,
  getOrderedProducts,
  addOrderedProduct,
  deleteOrderedProduct,
  addOrderedProduct,
findOnCartOrderedProducts,
  getOrderedProduct,
  updateOrderedProduct,
};
