const { Op } = require("sequelize");
const { Favorite,Product,ProductImage, ProductStat, ProductReview } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");

const findFavoriteByID = async (id) => {
  try {
    const favorite = await Favorite.findOne({
      where: {
        id,
      },
    });
    return favorite;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addFavorite = async (req, res) => {
  try {
    let { ProductId, UserId } = req.body;
    const response = await Favorite.create({
      ProductId,
      UserId,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getFavorites = async (req, res) => {
  try {
    const response = await Favorite.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        title: {
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
const getUserFavorites = async (req, res) => {
  try {
    const {id} = req.params;
    const response = await Favorite.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        title: {
          [Op.like]: `%${req.keyword}%`,
        },
        UserId:id
      },
      include:[{
        model:Product,
        include: [ProductImage, ProductStat, ProductReview]
      }]
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
const getFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const favorite = await findFavoriteByID(id);
    successResponse(res, favorite);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const favorite = await findFavoriteByID(id);
    const response = await favorite.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const favorite = await findFavoriteByID(id);
    const response = await favorite.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findFavoriteByID,
  getFavorites,
  addFavorite,
  deleteFavorite,
  addFavorite,
  getUserFavorites,
  getFavorite,
  updateFavorite,
};
