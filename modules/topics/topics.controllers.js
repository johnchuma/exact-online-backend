const { Op } = require("sequelize");
const {
  Topic,
  TopicImage,
  TopicStat,
  OrderedTopic,
  TopicReview,
  Favorite,
  User,
  Order,
  Shop,
} = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");
const moment = require("moment");

const findTopicByID = async (id) => {
  try {
    const product = await Topic.findOne({
      where: {
        id,
      },
      include: [
        TopicImage,
        TopicStat,
        {
          model: TopicReview,
          include: [User],
        },
        Shop,
      ],
    });
    return product;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const addTopic = async (req, res) => {
  try {
    let { ChatId, OrderId, ProductId } = req.body;
    const response = await Topic.findOrCreate({
      where: {
        ChatId,
        OrderId,
        ProductId,
      },
    });
    successResponse(res, response);
  } catch (error) {
    console.log(error);
    errorResponse(res, error);
  }
};
const getTopics = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Topic.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        ChatId: id,
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

const getTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Topic.findOne({
      where: {
        id,
      },
    });
    successResponse(res, product);
  } catch (error) {
    errorResponse(res, error);
  }
};
const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await findTopicByID(id);
    const response = await product.update({
      ...req.body,
    });
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};
const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await findTopicByID(id);
    const response = await product.destroy();
    successResponse(res, response);
  } catch (error) {
    errorResponse(res, error);
  }
};

module.exports = {
  findTopicByID,
  getTopics,
  addTopic,
  deleteTopic,
  addTopic,
  getTopic,
  updateTopic,
};
