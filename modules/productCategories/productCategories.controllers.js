const { Op } = require("sequelize");
const { ProductCategory, Category } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");

const findProductCategoryByID = async (id) => {
  try {
    const productCategory = await ProductCategory.findOne({
      where: {
        id,
      },
    });
    return productCategory;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addProductCategory = async (req, res) => {
  try {
    let { productId, categoryId } = req.body;
    const response = await ProductCategory.create({
      productId,
      categoryId,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getProductCategories = async (req, res) => {
  try {
    const response = await ProductCategory.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      include: [Category],
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

const getProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const productCategory = await findProductCategoryByID(id);
    successResponse(res, productCategory);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const productCategory = await findProductCategoryByID(id);
    const response = await productCategory.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteProductCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const productCategory = await findProductCategoryByID(id);
    const response = await productCategory.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findProductCategoryByID,
  getProductCategories,
  addProductCategory,
  deleteProductCategory,
  addProductCategory,
  getProductCategory,
  updateProductCategory,
};
