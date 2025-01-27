const { Op } = require("sequelize");
const { Reel, User, Shop, Sequelize } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");
const { getVideoMetadata } = require("../../utils/get_video_metadata");

const findReelByID = async (id) => {
  try {
    const reel = await Reel.findOne({
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
    const user = req.user;

    const response = await Reel.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        caption: {
          [Op.like]: `%${req.keyword}%`,
        },
      },
      include: [
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
            ],
          },
        },
      ],
      replacements: { userId: user.id }, // Passing user.id as a parameter
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
    const reel = await findReelByID(id);
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
  findReelByID,
  getReels,
  addReel,
  getShopReels,
  deleteReel,
  addReel,
  getReel,
  updateReel,
};
