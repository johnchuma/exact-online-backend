const { Op } = require("sequelize");
const { CategoryProductSpecification } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");

const findCategoryProductSpecificationByID = async (id) => {
  try {
    const categoryproductspecification =
      await CategoryProductSpecification.findOne({
        where: {
          id,
        },
      });
    return categoryproductspecification;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addCategoryProductSpecification = async (req, res) => {
  try {
    let { label, expectedDataType, CategoryId } = req.body;
    const response = await CategoryProductSpecification.create({
      label,
      expectedDataType,
      CategoryId,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getCategoryProductSpecifications = async (req, res) => {
  try {
    const {id} = req.params
    const response = await CategoryProductSpecification.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        label: {
          [Op.like]: `%${req.keyword}%`,
        },
        CategoryId:id
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

const getCategoryProductSpecification = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryproductspecification =
      await findCategoryProductSpecificationByID(id);
    successResponse(res, categoryproductspecification);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateCategoryProductSpecification = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryproductspecification =
      await findCategoryProductSpecificationByID(id);
    const response = await categoryproductspecification.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteCategoryProductSpecification = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryproductspecification =
      await findCategoryProductSpecificationByID(id);
    const response = await categoryproductspecification.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findCategoryProductSpecificationByID,
  getCategoryProductSpecifications,
  addCategoryProductSpecification,
  deleteCategoryProductSpecification,
  addCategoryProductSpecification,
  getCategoryProductSpecification,
  updateCategoryProductSpecification,
};
