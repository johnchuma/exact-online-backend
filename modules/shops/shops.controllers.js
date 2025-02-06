const { Op, fn } = require("sequelize");
const {
  Shop,
  ShopCalender,
  ShopSubscription,
  ShopDocument,
  ShopView,
  ShopFollower,
  Sequelize,
} = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");
const { Fn } = require("sequelize/lib/utils");
const moment = require("moment");

const findShopByID = async (id) => {
  try {
    const shop = await Shop.findOne({
      where: {
        id,
      },
      include:[ShopCalender,ShopSubscription,ShopView]
    });
    return shop;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addShop = async (req, res) => {
  try {
    let { registeredBy, name, phone, address, description, UserId } = req.body;
    console.log(req.body);
    const response = await Shop.create({
      registeredBy,
      name,
      phone,
      address,
      description,
      UserId: UserId,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getShops = async (req, res) => {
  try {
    const response = await Shop.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
      },
      include: [ShopDocument, ShopFollower],
    
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


const getUserShops = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Shop.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
        UserId: id,
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
const getUserShopFollowings = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Shop.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      attributes: {
        include: [
          [
            Sequelize.literal(
              `(SELECT COUNT(*) 
              FROM "ShopFollowers"
              WHERE "ShopFollowers"."ShopId" = "Shop"."id")`
            ),
            "followers", // Alias for the count of followers
          ],
        ],
      },
      include: [
        {
          model: ShopFollower,
          attributes:[],
          where: {
            UserId: id,
          },
          required: true, // Ensures that only shops with followings are returned
        },
      ],
      group: ["Shop.id"], // Group by Shop ID to get followers per shop
    });

    // Fix for count: it should be a single number, not an array
    const count = response.count; // You can use this value directly, it's the total number of shops
    const rows = response.rows.map((shop) => ({
      ...shop.dataValues,
      followers: parseInt(shop.dataValues.followers, 10), // Parse followers as integer
    }));

    successResponse(res, {
      count, // Total number of shops
      page: req.page,
      rows, // Properly formatted rows
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

const getShop = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const shop = await Shop.findOne({
      where: {
        id,
      },
     
      attributes:{
        include: [
          [
            Sequelize.literal(
              `(EXISTS (
                SELECT 1
                FROM "ShopSubscriptions"
                WHERE "ShopSubscriptions"."ShopId" = "Shop"."id"
                AND "ShopSubscriptions"."expireDate" > NOW() 
              ))`
            ),
            "isSubscribed",
          ],
          [
            Sequelize.literal(
              `(SELECT COUNT(*) 
              FROM "ShopFollowers"
              WHERE "ShopFollowers"."ShopId" = "Shop"."id")`
            ),
            "followers", // Alias for the count of followers
          ],
          [
            Sequelize.literal(`
              (
                SELECT COUNT(*)
                FROM "ProductStats"
                JOIN "Products" ON "Products"."id" = "ProductStats"."ProductId"
                WHERE "Products"."ShopId" = "Shop"."id"
                AND "ProductStats"."type" = 'view'
              )
            `),
            "impressions" 
          ],
          [
            Sequelize.literal(`
              (
                SELECT COUNT(*)
                FROM "ProductStats"
                JOIN "Products" ON "Products"."id" = "ProductStats"."ProductId"
                WHERE "Products"."ShopId" = "Shop"."id"
                AND "ProductStats"."type" = 'share'
              )
            `),
            "shares" 
          ],
          [
            Sequelize.literal(`
              (
                SELECT COUNT(*)
                FROM "ProductStats"
                JOIN "Products" ON "Products"."id" = "ProductStats"."ProductId"
                WHERE "Products"."ShopId" = "Shop"."id"
                AND "ProductStats"."type" = 'call'
              )
            `),
            "calls" 
          ],
          [
            Sequelize.literal(`
              (
                SELECT COUNT(*)
                FROM "ShopViews"
                WHERE "ShopViews"."ShopId" = "Shop"."id"
              )
            `),
            "profileViews" 
          ],
          [
            Sequelize.literal(`
              (
                SELECT COUNT(*)
                FROM "ReelStats"
                JOIN "Reels" ON "Reels"."id" = "ReelStats"."ReelId"
                WHERE "Reels"."ShopId" = "Shop"."id"
                AND "ReelStats"."type" = 'like'
              )
            `),
            "reelLikes"
          ],          
        ],
      },
      include:[ShopCalender,{
        model:ShopSubscription,
        where:{
          expireDate:{
            [Op.gt]:Date.now()
          }
        },
        required:false
      },ShopView,],
    });
    successResponse(res, shop);
  } catch (error) {
    errorResponse(res, error);
  }
};

const updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, req.body);
    const shop = await findShopByID(id);

    let url = await getUrl(req);
    console.log(url, req.body);
    if (url) {
      req.body.shopImage = url;
    }
    const response = await shop.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const deleteShop = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await findShopByID(id);
    const response = await shop.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findShopByID,
  getShops,
  addShop,
  deleteShop,
  getUserShopFollowings,
  addShop,
  getShop,
  getUserShops,
  updateShop,
};
