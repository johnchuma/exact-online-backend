const { Op } = require("sequelize");
const {
  Product,
  ProductImage,
  ProductStat,
  ProductReview,
} = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");
const moment = require("moment");

const findProductByID = async (id) => {
  try {
    const product = await Product.findOne({
      where: {
        id,
      },
      include: [ProductImage, ProductStat, ProductReview],
    });
    return product;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addProduct = async (req, res) => {
  try {
    let {
      name,
      sellingPrice,
      priceIncludeDelivery,
      deliveryScope,
      productLink,
      isHidden,
      specifications,
      description,
      CategoryId,
      ShopId,
    } = req.body;
    const response = await Product.create({
      name,
      sellingPrice,
      priceIncludeDelivery,
      deliveryScope,
      productLink,
      isHidden,
      specifications,
      description,
      CategoryId,
      ShopId,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {
      name: {
        [Op.like]: `%${req.keyword}%`,
      },
    };
    if (category && category != "All") {
      filter.CategoryId = category;
    }
    const response = await Product.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: filter,
      include: [ProductImage, ProductStat, ProductReview],
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
const getNewArrivalProducts = async (req, res) => {
  try {
    const response = await Product.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
      },
      include: [ProductImage, ProductStat, ProductReview],
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
const getProductSearch = async (req, res) => {
  try {
    const { keyword } = req.params;
    const response = await Product.findAll({
      attributes: ["name"],
      where: {
        name: {
          [Op.like]: `%${keyword}%`,
        },
      },
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const getProductsForYou = async (req, res) => {
  try {
    const response = await Product.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
      },
      include: [ProductImage, ProductStat, ProductReview],
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
const getShopProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Product.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
        ShopId: id,
      },
      include: [ProductImage, ProductStat, ProductReview],
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
const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await findProductByID(id);
    const response = await Product.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
      },
      include: [ProductImage, ProductStat, ProductReview],
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
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await findProductByID(id);
    successResponse(res, product);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await findProductByID(id);
    const response = await product.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await findProductByID(id);
    const response = await product.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findProductByID,
  getProducts,
  addProduct,
  deleteProduct,
  getShopProducts,
  getNewArrivalProducts,
  getProductsForYou,
  getProductSearch,
  addProduct,
  getRelatedProducts,
  getProduct,
  updateProduct,
};
