const { Op } = require("sequelize");
const {
  Topic,
  OrderedProduct,
  Product,
  ProductImage,
  Service,
  ServiceImage,
  Message,
  Chat,
  Shop,
  User,
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
    let { ChatId, OrderId, ProductId, ServiceId } = req.body;
    
    // Validate that ChatId is provided
    if (!ChatId) {
      return errorResponse(res, new Error('ChatId is required'));
    }
    
    let options = { ChatId };
    
    // Add specific identifiers if provided
    if (OrderId) {
      options.OrderId = OrderId;
    } else if (ServiceId) {
      options.ServiceId = ServiceId;
    } else if (ProductId) {
      options.ProductId = ProductId;
    }
    // If none of the above, it's a general conversation topic
    
    let topic = await Topic.findOne({
      where: options,
    });
    
    if (!topic) {
      topic = await Topic.create({
        ChatId,
        OrderId,
        ProductId,
        ServiceId,
      });
    }
    
    topic = await Topic.findOne({
      where: { id: topic.id },
      include: [
        {
          model: Chat,
        },
      ],
    });
    
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
      order: [[Sequelize.col('"lastMessageDatetime"'), "DESC", "NULLS LAST"]],
      where: {
        ChatId: id,
        [Op.or]: [
          // General conversation topics (no specific ProductId, ServiceId, or OrderId)
          {
            ProductId: null,
            ServiceId: null,
            OrderId: null,
          },
          // Topics with ProductId that have existing Product
          {
            ProductId: {
              [Op.ne]: null,
            },
            [Op.and]: Sequelize.literal(`
              EXISTS (
                SELECT 1 FROM "Products" 
                WHERE "Products"."id" = "Topic"."ProductId"
              )
            `),
          },
          // Topics with ServiceId that have existing Service
          {
            ServiceId: {
              [Op.ne]: null,
            },
            [Op.and]: Sequelize.literal(`
              EXISTS (
                SELECT 1 FROM "Services" 
                WHERE "Services"."id" = "Topic"."ServiceId"
              )
            `),
          },
          // Topics with OrderId that have existing Order
          {
            OrderId: {
              [Op.ne]: null,
            },
            [Op.and]: Sequelize.literal(`
              EXISTS (
                SELECT 1 FROM "Orders" 
                WHERE "Orders"."id" = "Topic"."OrderId"
              )
            `),
          },
        ],
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
            "lastMessage",
          ],
          [
            Sequelize.literal(`(
              SELECT "createdAt"
              FROM "Messages"
              WHERE "Messages"."TopicId" = "Topic"."id"
              ORDER BY "Messages"."createdAt" DESC
              LIMIT 1
            )`),
            "lastMessageDatetime",
          ],
        ],
      },
      include: [
        {
          model: Order,
          required: false,
          include: [
            {
              model: OrderedProduct,
              required: false,
              include: {
                model: Product,
                include: [ProductImage],
                required: false,
              },
            },
          ],
        },
        {
          model: Product,
          required: false,
          include: [
            {
              model: ProductImage,
              required: false,
            },
          ],
        },
        {
          model: Service,
          required: false,
          include: [
            {
              model: ServiceImage,
              required: false,
            },
          ],
        },
        {
          model: Message,
        },
        {
          model: Chat,
        },
      ],
    });
    
    successResponse(res, {
      count: response.count,
      page: req.page,
      rows: response.rows,
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
      include: [
        {
          model: Order,
          include: [
            {
              model: OrderedProduct,
              include: {
                model: Product,
                include: [ProductImage],
              },
            },
          ],
        },
        {
          model: Product,
          include: [ProductImage],
        },
        {
          model: Service,
          include: [ServiceImage],
        },
        {
          model: Chat,
          include: [User, Shop],
        },
      ],
    });
    successResponse(res, topic);
  } catch (error) {
    console.log(error);
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
