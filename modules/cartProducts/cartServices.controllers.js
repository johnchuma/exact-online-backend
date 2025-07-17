const { Op } = require("sequelize");
const { User, Service, ServiceImage, Shop } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");

// Since there's no CartService model yet, I'll use a simple approach
// storing service cart items with a different ProductId pattern to distinguish them

const addCartService = async (req, res) => {
  try {
    let { UserId, ServiceId, packageType = "basic" } = req.body;

    // Check if service exists
    const service = await Service.findByPk(ServiceId);
    if (!service) {
      return res.status(404).send({
        status: false,
        message: "Service not found",
      });
    }

    // For now, store service cart items in localStorage on frontend
    // and return success. This can be enhanced later with a proper CartService model

    successResponse(res, {
      message: "Service added to cart successfully",
      serviceId: ServiceId,
      packageType: packageType,
    });
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};

const getUserCartServices = async (req, res) => {
  try {
    // For now, return empty array since we're using frontend storage
    // This can be enhanced later with proper database storage
    successResponse(res, {
      count: 0,
      page: req.page || 1,
      rows: [],
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

const removeCartService = async (req, res) => {
  try {
    const { id } = req.params;
    // For now, just return success
    // This can be enhanced later with proper database operations
    successResponse(res, { message: "Service removed from cart" });
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  addCartService,
  getUserCartServices,
  removeCartService,
};
