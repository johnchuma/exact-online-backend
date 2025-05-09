const { Op,Sequelize } = require("sequelize");
const {
  Product,
  ProductImage,
  ProductStat,
  OrderedProduct,
  CartProduct,
  ShopFollower,
  ProductReview,
  Favorite,
  User,
  Order,
  Shop,
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
      include: [ProductImage, ProductStat, {
        model:ProductReview,
        include:[User]
      },Shop],
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
      isNegotiable,
      specifications,
      description,
      CategoryId,
      ShopId,
    } = req.body;
    console.log(description);
    const response = await Product.create({
      name,
      sellingPrice,
      priceIncludeDelivery,
      deliveryScope,
      productLink,
      isNegotiable,
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
    console.log(req.keyword)
    let filter = {
      name: {
        [Op.like]: `%${req.keyword??""}%`,
      },
    };
    if (category && category != "All") {
      filter.CategoryId = category;
    }
    console.log(filter)

    const response = await Product.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: filter,
      include: [ProductImage,Shop, ProductStat, ProductReview,{
        model:Favorite,
        where:{
          UserId:req.user.id
        },
        required:false
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
      order:[["createdAt","DESC"]],
      include: [ProductImage,Shop, ProductStat, ProductReview,{
        model:Favorite,
        where:{
          UserId:req.user.id
        },
        required:false
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
const getProductSearch = async (req, res) => {
  try {
    const { keyword } = req.params;
    console.log(keyword);
    const response = await Product.findAll({
      where: {
        name: {
          [Op.iLike]: `%${keyword}%`,
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
    const {id} = req.user
    const response = await Product.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
      },
      include: [ProductImage,Shop, ProductStat, ProductReview,{
        model:Favorite,
        where:{
          UserId:req.user.id
        },
        required:false
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
      include: [ProductImage, ProductStat, ProductReview,{
        model:Favorite,
        where:{
          UserId:req.user.id
        },
        required:false
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
const getRelatedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)
    const product = await findProductByID(id);
    const response = await Product.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
        id:{
          [Op.ne]:id
        },
        CategoryId:product.CategoryId
      },
      include: [ProductImage, ProductStat, ProductReview,{
        model:Favorite,
        where:{
          UserId:req.user.id
        },
        required:false

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
const getProduct = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const product = await  Product.findOne({
      where: {
        id,
      },
      include: [
        {
          model:CartProduct,
          where:{
            UserId:req.user.id
          },
          required:false
        },
        ProductImage, ProductStat, {
        model:ProductReview,
        required:false,
        description:{
          [Op.ne]:null
        },
        include:[User]
      },{
        model:Shop,
        attributes: {
          include: [
            [
              Sequelize.literal(`
                EXISTS (
                  SELECT 1
                  FROM "ShopFollowers"
                  WHERE "ShopFollowers"."UserId" = :userId
                  AND "ShopFollowers"."ShopId" = "Shop"."id"
                )
              `),
              'following'
            ],
          ]},
          include: [
            {
              model: ShopFollower,
              where: { UserId: user.id },
              required: false
            }
          ]
        
      },{
        model:Favorite,
        
        where:{
          UserId:req.user.id
        },
        required:false

      }],
      replacements: { userId: user.id }
    });
    successResponse(res, product);
  } catch (error) {
    console.log(error)
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
