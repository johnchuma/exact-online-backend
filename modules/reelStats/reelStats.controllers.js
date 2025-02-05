const { Op } = require("sequelize");
const { ReelStat } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");

const findReelStatByID = async (id) => {
  try {
    const ReelStat = await ReelStat.findOne({
      where: {
        id,
      },
    });
    return ReelStat;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addReelStat = async (req, res) => {
  try {
    let { ReelId, UserId, type } = req.body;
    const response = await ReelStat.create({
      ReelId,
      UserId,
      type,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getReelStats = async (req, res) => {
  try {
    const response = await ReelStat.findAndCountAll({
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

const getReelStat = async (req, res) => {
  try {
    const { id } = req.params;
    const ReelStat = await findReelStatByID(id);
    successResponse(res, ReelStat);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateReelStat = async (req, res) => {
  try {
    const { id } = req.params;
    const ReelStat = await findReelStatByID(id);
    const response = await ReelStat.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteReelStat = async (req, res) => {
  try {
    const { id } = req.params;
    const reelStat = await ReelStat.findOne({
      where:{
        id
      }
    });
    const response = await reelStat.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findReelStatByID,
  getReelStats,
  addReelStat,
  deleteReelStat,
  addReelStat,
  getReelStat,
  updateReelStat,
};
