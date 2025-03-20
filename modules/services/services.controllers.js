const { Op } = require("sequelize");
const { Service, ServiceImage, Shop } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");

const findServiceByID = async (id) => {
  try {
    const service = await Service.findOne({
      where: {
        id,
      },
      include: [ServiceImage, Shop],
    });
    return service;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addService = async (req, res) => {
  try {
    let { name, price, serviceLink, description, CategoryId, ShopId } =
      req.body;
    const response = await Service.create({
      name,
      price,
      serviceLink,
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
const getServices = async (req, res) => {
  try {
    const { category } = req.query;
    console.log(req.keyword);
    let filter = {
      name: {
        [Op.like]: `%${req.keyword ?? ""}%`,
      },
    };
    if (category && category != "All") {
      filter.CategoryId = category;
    }

    const response = await Service.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: filter,
      include: [ServiceImage, Shop],
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
const getNewArrivalServices = async (req, res) => {
  try {
    const response = await Service.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
      },
      order: [["createdAt", "DESC"]],
      include: [ServiceImage, Shop],
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
const getServiceSearch = async (req, res) => {
  try {
    const { keyword } = req.params;
    console.log(keyword);
    const response = await Service.findAll({
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
const getServicesForYou = async (req, res) => {
  try {
    const { id } = req.user;
    const response = await Service.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
      },
      include: [ServiceImage, Shop],
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
const getShopServices = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Service.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
        ShopId: id,
      },
      include: [ServiceImage],
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
const getRelatedServices = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await findServiceByID(id);
    const response = await Service.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
      },
      include: [ServiceImage],
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
const getService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findOne({
      where: {
        id,
      },
      include: [ServiceImage, Shop],
    });
    successResponse(res, service);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await findServiceByID(id);
    const response = await service.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await findServiceByID(id);
    const response = await service.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findServiceByID,
  getServices,
  addService,
  deleteService,
  getShopServices,
  getNewArrivalServices,
  getServicesForYou,
  getServiceSearch,
  addService,
  getRelatedServices,
  getService,
  updateService,
};
