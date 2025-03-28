const { Op } = require("sequelize");
const { ServiceImage } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");

const findServiceImageByID = async (id) => {
  try {
    const serviceimage = await ServiceImage.findOne({
      where: {
        id,
      },
    });
    return serviceimage;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addServiceImage = async (req, res) => {
  try {
    let { ServiceId } = req.body;
    const image = await getUrl(req);
    console.log(ServiceId,image);
    const response = await ServiceImage.create({
      ServiceId,
      image,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getServiceImages = async (req, res) => {
  try {
    const response = await ServiceImage.findAndCountAll({
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

const getServiceImage = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceimage = await findServiceImageByID(id);
    successResponse(res, serviceimage);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateServiceImage = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceimage = await findServiceImageByID(id);
    const response = await serviceimage.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteServiceImage = async (req, res) => {
  try {
    const { id } = req.params;
    const serviceimage = await findServiceImageByID(id);
    const response = await serviceimage.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findServiceImageByID,
  getServiceImages,
  addServiceImage,
  deleteServiceImage,
  addServiceImage,
  getServiceImage,
  updateServiceImage,
};
