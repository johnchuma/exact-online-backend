const { Op } = require("sequelize");
const { Category, CategoryProductSpecification } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");

const findCategoryByID = async (id) => {
  try {
    const category = await Category.findOne({
      where: {
        id,
      },
    });
    return category;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addCategory = async (req, res) => {
  try {
    let { name, type } = req.body;
    const image = await getUrl(req);
    const response = await Category.create({
      name,
      type,
      image,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};

const getCategories = async (req, res) => {
  try {
    const {type} = req.query;
    let options = {
      name: {
        [Op.like]: `%${req.keyword}%`,
      }
    }
    if(type){
      options.type = type =="null"?"product":type
    }
    const response = await Category.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where:options,
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
const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await findCategoryByID(id);
    successResponse(res, category);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await findCategoryByID(id);
    const image = await getUrl(req);
    console.log(req.body);
    console.log(image);
    if (image != null) {
      req.body.image = image;
    }
    const response = await category.update({
      ...req.body,
    });
    console.log(req.body);
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await findCategoryByID(id);
    const response = await category.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
module.exports = {
  findCategoryByID,
  getCategories,
  addCategory,
  deleteCategory,
  addCategory,
  getCategory,
  updateCategory,
};
