const { Op } = require("sequelize");
const { ProductReview } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");

const findProductReviewByID = async (id) => {
  try {
    const productreview = await ProductReview.findOne({
      where: {
        id,
      },
    });
    return productreview;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addProductReview = async (req, res) => {
  try {
    let { productId, userId, rating, description } = req.body;
    const response = await ProductReview.create({
      productId,
      userId,
      rating,
      description,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getProductReviews = async (req, res) => {
  try {
    const response = await ProductReview.findAndCountAll({
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

const getProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const productreview = await findProductReviewByID(id);
    successResponse(res, productreview);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const productreview = await findProductReviewByID(id);
    const response = await productreview.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteProductReview = async (req, res) => {
  try {
    const { id } = req.params;
    const productreview = await findProductReviewByID(id);
    const response = await productreview.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findProductReviewByID,
  getProductReviews,
  addProductReview,
  deleteProductReview,
  addProductReview,
  getProductReview,
  updateProductReview,
};
