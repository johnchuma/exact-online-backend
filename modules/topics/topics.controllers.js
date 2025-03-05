const { Op } = require("sequelize");
const {
  Topic,
  OrderedProduct,
  Product,
  ProductImage,
  Message,
  Order,
  Sequelize,
} = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");


const findTopicByID = async (id) => {
  try {
    const product = await Topic.findOne({
      where: {
        id,
      },
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
    let options;
    if(OrderId){
      options = {
        ChatId,
        OrderId
      }
    }else{
      options = {
        ChatId,
        ProductId
      }
    }
    let topic = await Topic.findOne({
      where: options,
    });
    if(!topic){
      topic = await Topic.create({
        ChatId,
        OrderId,
        ProductId,
      })
    }
    successResponse(res, topic);
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
      order:[["createdAt",'DESC']],
      where: {
        ChatId: id,
      },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT "message"
              FROM "Messages"
              WHERE "Messages"."TopicId" = "Topic"."id"
              ORDER BY "Messages"."createdAt" DESC
              LIMIT 1
            )`),
            'lastMessage'
          ],
        ],
      },
      include: [{
        model: Order,
        include: [{
          model: OrderedProduct,
          include: {
            model: Product,
            include: [ProductImage]
          },
        }]
      }, {
        model: Product,
        include: [ProductImage],
      }, {
        model: Message
      }]
    });
    successResponse(res, {
      count: response.count,
      page: req.page,
      rows: response.rows, // Explicitly include rows instead of spreading entire response
    });
  } catch (error) {
    errorResponse(res, error);
  }
};

const getTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await Topic.findOne({
      where: {
        id,
      },
      include:[{
        model:Order,
        include:[{
          model:OrderedProduct,
          include:{
            model:Product,
            include:[ProductImage]
          }
        }]
      },{
        model:Product,
        include:[ProductImage]
      }]
    });
    successResponse(res, topic);
  } catch (error) {
    console.log(error)
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
