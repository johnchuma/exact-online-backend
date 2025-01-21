const { Op } = require("sequelize");
const { ProductColor } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");

const findProductColorByID = async (id) => {
  try {
    const productcolor = await ProductColor.findOne({
      where: {
        id,
      },
    });
    return productcolor;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addProductColor = async (req, res) => {
  try {
    let { ProductId, color } = req.body;
    const response = await ProductColor.create({
      ProductId,
      color,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getProductColors = async (req, res) => {
  try {
    const response = await ProductColor.findAndCountAll({
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

const getProductColor = async (req, res) => {
  try {
    const { id } = req.params;
    const productcolor = await findProductColorByID(id);
    successResponse(res, productcolor);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateProductColor = async (req, res) => {
  try {
    const { id } = req.params;
    const productcolor = await findProductColorByID(id);
    const response = await productcolor.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteProductColor = async (req, res) => {
  try {
    const { id } = req.params;
    const productcolor = await findProductColorByID(id);
    const response = await productcolor.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findProductColorByID,
  getProductColors,
  addProductColor,
  deleteProductColor,
  addProductColor,
  getProductColor,
  updateProductColor,
};
