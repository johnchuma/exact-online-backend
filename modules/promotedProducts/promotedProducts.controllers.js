const { Op } = require("sequelize");
const { PromotedProduct } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");

const findPromotedProductByID = async (id) => {
  try {
    const promotedproduct = await PromotedProduct.findOne({
      where: {
        id,
      },
    });
    return promotedproduct;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addPromotedProduct = async (req, res) => {
  try {
    let { productId, budget, startDate, endDate } = req.body;
    const response = await PromotedProduct.create({
      productId,
      budget,
      startDate,
      endDate,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getPromotedProducts = async (req, res) => {
  try {
    const response = await PromotedProduct.findAndCountAll({
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

const getPromotedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const promotedproduct = await findPromotedProductByID(id);
    successResponse(res, promotedproduct);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updatePromotedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const promotedproduct = await findPromotedProductByID(id);
    const response = await promotedproduct.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deletePromotedProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const promotedproduct = await findPromotedProductByID(id);
    const response = await promotedproduct.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findPromotedProductByID,
  getPromotedProducts,
  addPromotedProduct,
  deletePromotedProduct,
  addPromotedProduct,
  getPromotedProduct,
  updatePromotedProduct,
};
