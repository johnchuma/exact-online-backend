const { Op } = require("sequelize");
const { ProductImage } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");

const findProductImageByID = async (id) => {
  try {
    const productimage = await ProductImage.findOne({
      where: {
        id,
      },
    });
    return productimage;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addProductImage = async (req, res) => {
  try {
    let { ProductId } = req.body;
    const image = await getUrl(req);
    const response = await ProductImage.create({
      ProductId,
      image,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getProductImages = async (req, res) => {
  try {
    const response = await ProductImage.findAndCountAll({
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

const getProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const productimage = await findProductImageByID(id);
    successResponse(res, productimage);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const productimage = await findProductImageByID(id);
    const response = await productimage.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const productimage = await findProductImageByID(id);
    const response = await productimage.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findProductImageByID,
  getProductImages,
  addProductImage,
  deleteProductImage,
  addProductImage,
  getProductImage,
  updateProductImage,
};
