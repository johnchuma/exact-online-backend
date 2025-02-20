const { Op } = require("sequelize");
const { Notification } = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");

const findNotificationByID = async (id) => {
  try {
    const notification = await Notification.findOne({
      where: {
        id,
      },
    });
    return notification;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addNotification = async (req, res) => {
  try {
    let { title, message } = req.body;
    const image = await getUrl(req);
    const response = await Notification.create({
      title,
      message,
      image,
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};

const getNotifications = async (req, res) => {
    try {
      const response = await Notification.findAndCountAll({
        limit: req.limit,
        offset: req.offset,
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
const getSingleNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await findNotificationByID(id);
    successResponse(res, notification);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await findNotificationByID(id);
    const response = await notification.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await findNotificationByID(id);
    const response = await notification.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findNotificationByID,
  getNotifications,
  addNotification,
  deleteNotification,
  getSingleNotification,
  updateNotification,
};
