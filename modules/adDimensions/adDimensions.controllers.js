const { Op } = require("sequelize");
const { AdDimension } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");

const findAdDimensionByID = async (id) => {
  try {
    const addimension = await AdDimension.findOne({
      where: {
        id,
      },
    });
    return addimension;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addAdDimension = async (req, res) => {
  try {
    let { width, height } = req.body;
    const response = await AdDimension.create({
      width,
      height,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getAdDimensions = async (req, res) => {
  try {
    const response = await AdDimension.findAndCountAll({
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

const getAdDimension = async (req, res) => {
  try {
    const { id } = req.params;
    const addimension = await findAdDimensionByID(id);
    successResponse(res, addimension);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateAdDimension = async (req, res) => {
  try {
    const { id } = req.params;
    const addimension = await findAdDimensionByID(id);
    const response = await addimension.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteAdDimension = async (req, res) => {
  try {
    const { id } = req.params;
    const addimension = await findAdDimensionByID(id);
    const response = await addimension.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findAdDimensionByID,
  getAdDimensions,
  addAdDimension,
  deleteAdDimension,
  addAdDimension,
  getAdDimension,
  updateAdDimension,
};
