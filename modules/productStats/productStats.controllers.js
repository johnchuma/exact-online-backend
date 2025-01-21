const { Op } = require("sequelize");
const { ProductStat } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");

const findProductStatByID = async (id) => {
  try {
    const productstat = await ProductStat.findOne({
      where: {
        id,
      },
    });
    return productstat;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addProductStat = async (req, res) => {
  try {
    let { ProductId, UserId, type } = req.body;
    const response = await ProductStat.create({
      ProductId,
      UserId,
      type,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getProductStats = async (req, res) => {
  try {
    const response = await ProductStat.findAndCountAll({
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

const getProductStat = async (req, res) => {
  try {
    const { id } = req.params;
    const productstat = await findProductStatByID(id);
    successResponse(res, productstat);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateProductStat = async (req, res) => {
  try {
    const { id } = req.params;
    const productstat = await findProductStatByID(id);
    const response = await productstat.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteProductStat = async (req, res) => {
  try {
    const { id } = req.params;
    const productstat = await findProductStatByID(id);
    const response = await productstat.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findProductStatByID,
  getProductStats,
  addProductStat,
  deleteProductStat,
  addProductStat,
  getProductStat,
  updateProductStat,
};
