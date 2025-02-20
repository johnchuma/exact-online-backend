const { Op } = require("sequelize");
const { Reel, User, Shop, Sequelize, ShopFollower,ReelStat } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");
const { getVideoMetadata } = require("../../utils/get_video_metadata");

const addReel = async (req, res) => {
  try {
    let { caption, ShopId } = req.body;
    const videoUrl = await getUrl(req);
    const metadata = await getVideoMetadata(req);
    console.log(metadata);
    const response = await Reel.create({
      videoUrl,
      caption,
      duration: metadata.duration,
      thumbnail: metadata.thumbnail,
      ShopId,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getReels = async (req, res) => {
  try {
    const response = await Reel.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        caption: {
          [Op.like]: `%${req.keyword}%`,
        },
      },
      attributes: {
        include: [
          [
            Sequelize.literal(`
              (
                SELECT COUNT(*)
                FROM "ReelStats"
                WHERE "ReelStats"."ReelId" = "Reel"."id"
                AND "ReelStats"."type" = 'like'
              )
            `),
            "likes", // Alias for total likes
          ],
          
        ],
      },
      include: [Shop],
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
const getShopReels = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);

    const response = await Reel.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        caption: {
          [Op.like]: `%${req.keyword}%`,
        },
        ShopId:id
      },
      attributes: {
        include: [
          [
            Sequelize.literal(`
              (
                SELECT COUNT(*)
                FROM "ReelStats"
                WHERE "ReelStats"."ReelId" = "Reel"."id"
                AND "ReelStats"."type" = 'like'
              )
            `),
            "likes", // Alias for total likes
          ],
          
        ],
      },
      include: [
        {
          model: Shop,
        },
      ],
    });
    successResponse(res, {
      count: response.count,
      page: req.page,
      rows: response.rows,
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

const getReel = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const reel = await Reel.findOne({
      where: {
        id,
      },
      include: [
       {
        model:ReelStat,
        where: {
          UserId: user.id,
        },
        required:false
       },
        {
          model: Shop,
          attributes: {
            include: [
              [
                Sequelize.literal(
                  `(EXISTS (
                    SELECT 1
                    FROM "ShopFollowers"
                    WHERE "ShopFollowers"."UserId" = :userId
                    AND "ShopFollowers"."ShopId" = "Shop"."id"
                  ))`
                ),
                "following", // Alias for whether the user follows the shop
              ],
              [
                Sequelize.literal(`
                  (
                    SELECT COUNT(*)
                    FROM "ReelStats"
                    WHERE "ReelStats"."ReelId" = "Reel"."id"
                    AND "ReelStats"."type" = 'like'
                  )
                `),
                "likes", // Alias for total likes
              ],
              [
                Sequelize.literal(
                  `(EXISTS (
                    SELECT 1
                    FROM "ReelStats"
                    WHERE "ReelStats"."UserId" = :userId
                    AND "ReelStats"."type" = 'like'
                  ))`
                ),
                "liked", // Alias for whether the user follows the shop
              ],
              
            ],
          },
          include: [
            {
              model: ShopFollower,
              where: {
                UserId: user.id,
              },
              required: false,
            },
           
          ],
        },
        
      ],
      replacements: { userId: user.id }, // Passing user.id as a parameter
    });
    
    successResponse(res, reel);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateReel = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await findReelByID(id);
    const response = await reel.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteReel = async (req, res) => {
  try {
    const { id } = req.params;
    const reel = await findReelByID(id);
    const response = await reel.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  getReels,
  addReel,
  getShopReels,
  deleteReel,
  addReel,
  getReel,
  updateReel,
};
