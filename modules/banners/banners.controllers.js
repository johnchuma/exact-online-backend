const { Op } = require("sequelize");
const { Banner } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");

const findBannerByID = async (id) => {
  try {
    const ad = await Banner.findOne({
      where: {
        id,
      },
    });
    return ad;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addBanner = async (req, res) => {
  try {
    let { properties } = req.body;
    const image = await getUrl(req);
    const response = await Banner.create({
      properties,
      image
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};


const getBanners = async (req, res) => {
  try {
    const response = await Banner.findAll();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

const getBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await findBannerByID(id);
    successResponse(res, ad);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await findBannerByID(id);
    const response = await ad.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const ad = await findBannerByID(id);
    const response = await ad.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findBannerByID,
  getBanners,
  addBanner,
  deleteBanner,
  addBanner,
  getBanner,
  updateBanner,
};
