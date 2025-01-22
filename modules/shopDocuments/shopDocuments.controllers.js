const { Op } = require("sequelize");
const { ShopDocument } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");

const findShopDocumentByID = async (id) => {
  try {
    const shopdocument = await ShopDocument.findOne({
      where: {
        id,
      },
    });
    return shopdocument;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addShopDocument = async (req, res) => {
  try {
    let { title, ShopId } = req.body;
    const url = await getUrl(req);
    console.log(req.body)
    const response = await ShopDocument.create({
      title,
      url,
      ShopId,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getShopDocuments = async (req, res) => {
  try {
    const response = await ShopDocument.findAndCountAll({
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

const getShopDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const shopdocument = await findShopDocumentByID(id);
    successResponse(res, shopdocument);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateShopDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const shopdocument = await findShopDocumentByID(id);
    const response = await shopdocument.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteShopDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const shopdocument = await findShopDocumentByID(id);
    const response = await shopdocument.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findShopDocumentByID,
  getShopDocuments,
  addShopDocument,
  deleteShopDocument,
  addShopDocument,
  getShopDocument,
  updateShopDocument,
};
