const { Op } = require("sequelize");
const { CartProduct, User,Product,Order,ProductImage, ProductStat, ProductReview,Shop,Favorite } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");

const findCartProductByID = async (id) => {
  try {
    const reel = await CartProduct.findOne({
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
const addCartProduct = async (req, res) => {
  try {
    let { UserId, ProductId } = req.body;
    const response = await CartProduct.create({
      UserId,
      ProductId,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getUserCartProducts = async (req, res) => {
  try {
    const {id} = req.params;
    const response = await CartProduct.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where:{
         UserId:id
      },
      include: [{
        model:Product,
        include:[ProductImage,Shop]
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



const getCartProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await findCartProductByID(id);
    successResponse(res, reel);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateCartProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await findCartProductByID(id);
    const response = await reel.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteCartProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await findCartProductByID(id);
    const response = await reel.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findCartProductByID,
  addCartProduct,
  deleteCartProduct,
  addCartProduct,
  getUserCartProducts,
  getCartProduct,
  updateCartProduct,
};
