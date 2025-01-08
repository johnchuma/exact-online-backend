const { Op } = require("sequelize");
const { Reel, User } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");

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
    let { caption, shopId } = req.body;
    const videoUrl = await getUrl(req);
    const response = await Reel.create({
      videoUrl,
      caption,
      shopId,
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
        title: {
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
    const response = await Reel.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        title: {
          [Op.like]: `%${req.keyword}%`,
        },
        shopId: id,
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
