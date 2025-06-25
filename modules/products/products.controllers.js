const { Op, Sequelize } = require("sequelize");
const {
  Product,
  ProductImage,
  ProductStat,
  OrderedProduct,
  CartProduct,
  ShopFollower,
  ProductReview,
  Favorite,
  User,
  Order,
  Shop,
} = require("../../models");
const { errorResponse, successResponse } = require("../../utils/responses");
const { getUrl } = require("../../utils/get_url");
const moment = require("moment");
const logger = require("../../utils/logger");
const { v4: uuidv4 } = require("uuid"); // For requestId

const childLogger = logger.child({ module: "Products Module" });

const findProductByID = async (id) => {
  const requestId = uuidv4();
  try {
    childLogger.info("Finding product by ID", { requestId, productId: id });
    const product = await Product.findOne({
      where: { id },
      include: [ProductImage, ProductStat, { model: ProductReview, include: [User] }, Shop],
    });
    if (!product) {
      childLogger.warn("Product not found", { requestId, productId: id });
    } else {
      childLogger.info("Product found", { requestId, productId: id });
    }
    return product;
  } catch (error) {
    childLogger.error("Failed to find product", {
      requestId,
      productId: id,
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Add a new product
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewProduct'
 *     responses:
 *       200:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       500:
 *         description: Failed to create product
 */
const addProduct = async (req, res) => {
  const requestId = uuidv4();
  try {
    childLogger.http("Received add product request", {
      requestId,
      method: req.method,
      url: req.url,
      body: req.body,
    });

    const {
      name,
      sellingPrice,
      priceIncludeDelivery,
      deliveryScope,
      productLink,
      isHidden,
      isNegotiable,
      specifications,
      description,
      CategoryId,
      ShopId,
    } = req.body;
    childLogger.debug("Request body", { requestId, body: req.body });

    childLogger.info("Creating new product", {
      requestId,
      name,
      CategoryId,
      ShopId,
      isHidden,
      isNegotiable,
    });
    const response = await Product.create({
      name,
      sellingPrice:`${sellingPrice}`.replace(",",""),
      priceIncludeDelivery,
      deliveryScope,
      productLink,
      isNegotiable,
      isHidden,
      specifications,
      description,
      CategoryId,
      ShopId,
    });

    childLogger.info("Product added successfully", {
      requestId,
      productId: response.id,
      name,
      CategoryId,
      ShopId,
    });
    successResponse(res, response);
  } catch (error) {
    childLogger.error("Failed to create product", {
      requestId,
      name: req.body.name,
      CategoryId: req.body.CategoryId,
      ShopId: req.body.ShopId,
      error: error.message,
      stack: error.stack,
    });
    errorResponse(res, error);
  }
};

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get a list of products
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully fetched products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 rows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Failed to fetch products
 */
const getProducts = async (req, res) => {
  const requestId = uuidv4();
  try {
    const { category } = req.query;
    childLogger.http("Received get products request", {
      requestId,
      method: req.method,
      url: req.url,
      query: { category, keyword: req.keyword, limit: req.limit, offset: req.offset },
    });

    let filter = {
      name: {
        [Op.like]: `%${req.keyword ?? ""}%`,
      },
    };
    if (category && category !== "All") {
      filter.CategoryId = category;
    }
    childLogger.debug("Applying filter", { requestId, filter });

    childLogger.info("Fetching products", {
      requestId,
      category,
      keyword: req.keyword,
      limit: req.limit,
      offset: req.offset,
    });
    const response = await Product.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: filter,
      include: [
        ProductImage,
        {
          model:Shop,
          required:true
        },
        ProductStat,
        ProductReview,
        {
          model: Favorite,
          where: { UserId: req.user.id },
          required: false,
        },
      ],
    });

    childLogger.info("Products fetched successfully", {
      requestId,
      count: response.count,
      page: req.page,
      category,
    });
    successResponse(res, {
      count: response.count,
      page: req.page,
      ...response,
    });
  } catch (error) {
    childLogger.error("Failed to fetch products", {
      requestId,
      category: req.query.category,
      keyword: req.keyword,
      limit: req.limit,
      offset: req.offset,
      error: error.message,
      stack: error.stack,
    });
    errorResponse(res, error);
  }
};

const getNewArrivalProducts = async (req, res) => {
  const requestId = uuidv4();
  try {
    childLogger.http("Received get new arrival products request", {
      requestId,
      method: req.method,
      url: req.url,
      query: { keyword: req.keyword, limit: req.limit, offset: req.offset },
    });

    childLogger.info("Fetching new arrival products", {
      requestId,
      keyword: req.keyword,
      limit: req.limit,
      offset: req.offset,
    });
    const response = await Product.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
      },
      order: [["createdAt", "DESC"]],
      include: [
        ProductImage,
        {
          model:Shop,
          required:true
        },
        ProductStat,
        ProductReview,
        {
          model: Favorite,
          where: { UserId: req.user.id },
          required: false,
        },
      ],
    });

    childLogger.info("New arrival products fetched successfully", {
      requestId,
      count: response.count,
      page: req.page,
    });
    successResponse(res, {
      count: response.count,
      page: req.page,
      ...response,
    });
  } catch (error) {
    childLogger.error("Failed to fetch new arrival products", {
      requestId,
      keyword: req.keyword,
      limit: req.limit,
      offset: req.offset,
      error: error.message,
      stack: error.stack,
    });
    errorResponse(res, error);
  }
};

const getProductSearch = async (req, res) => {
  const requestId = uuidv4();
  try {
    const { keyword } = req.params;
    childLogger.http("Received product search request", {
      requestId,
      method: req.method,
      url: req.url,
      params: { keyword },
    });

    childLogger.info("Searching products", { requestId, keyword });
    const response = await Product.findAll({
      where: {
        name: {
          [Op.iLike]: `%${keyword}%`,
        },
      },
    });

    childLogger.info("Product search completed", { requestId, keyword, count: response.length });
    successResponse(res, response);
  } catch (error) {
    childLogger.error("Failed to search products", {
      requestId,
      keyword: req.params.keyword,
      error: error.message,
      stack: error.stack,
    });
    errorResponse(res, error);
  }
};

const getProductsForYou = async (req, res) => {
  const requestId = uuidv4();
  try {
    const { id } = req.user;
    childLogger.http("Received get products for you request", {
      requestId,
      method: req.method,
      url: req.url,
      query: { keyword: req.keyword, limit: req.limit, offset: req.offset },
      userId: id,
    });

    childLogger.info("Fetching products for user", {
      requestId,
      userId: id,
      keyword: req.keyword,
      limit: req.limit,
      offset: req.offset,
    });
    const response = await Product.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
      },
      include: [
        ProductImage,
        {
          model:Shop,
          required:true
        },
        ProductStat,
        ProductReview,
        {
          model: Favorite,
          where: { UserId: req.user.id },
          required: false,
        },
      ],
    });

    childLogger.info("Products for user fetched successfully", {
      requestId,
      userId: id,
      count: response.count,
      page: req.page,
    });
    successResponse(res, {
      count: response.count,
      page: req.page,
      ...response,
    });
  } catch (error) {
    childLogger.error("Failed to fetch products for user", {
      requestId,
      userId: req.user?.id,
      keyword: req.keyword,
      limit: req.limit,
      offset: req.offset,
      error: error.message,
      stack: error.stack,
    });
    errorResponse(res, error);
  }
};

const getShopProducts = async (req, res) => {
  const requestId = uuidv4();
  try {
    const { id } = req.params;
    childLogger.http("Received get shop products request", {
      requestId,
      method: req.method,
      url: req.url,
      params: { id },
      query: { keyword: req.keyword, limit: req.limit, offset: req.offset },
    });

    childLogger.info("Fetching shop products", {
      requestId,
      shopId: id,
      keyword: req.keyword,
      limit: req.limit,
      offset: req.offset,
    });
    const response = await Product.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
        ShopId: id,
      },
      include: [
        ProductImage,
        ProductStat,
        ProductReview,
        {
          model: Favorite,
          where: { UserId: req.user.id },
          required: false,
        },
      ],
    });

    childLogger.info("Shop products fetched successfully", {
      requestId,
      shopId: id,
      count: response.count,
      page: req.page,
    });
    successResponse(res, {
      count: response.count,
      page: req.page,
      ...response,
    });
  } catch (error) {
    childLogger.error("Failed to fetch shop products", {
      requestId,
      shopId: req.params.id,
      keyword: req.keyword,
      limit: req.limit,
      offset: req.offset,
      error: error.message,
      stack: error.stack,
    });
    errorResponse(res, error);
  }
};

const getRelatedProducts = async (req, res) => {
  const requestId = uuidv4();
  try {
    const { id } = req.params;
    childLogger.http("Received get related products request", {
      requestId,
      method: req.method,
      url: req.url,
      params: { id },
      query: { keyword: req.keyword, limit: req.limit, offset: req.offset },
    });

    childLogger.info("Fetching product for related products", { requestId, productId: id });
    const product = await findProductByID(id);

    if (!product) {
      childLogger.warn("Product not found", { requestId, productId: id });
      return res.status(404).send({
        status: false,
        message: "Product not found",
      });
    }

    childLogger.info("Fetching related products", {
      requestId,
      productId: id,
      CategoryId: product.CategoryId,
      keyword: req.keyword,
      limit: req.limit,
      offset: req.offset,
    });
    const response = await Product.findAndCountAll({
      limit: req.limit,
      offset: req.offset,
      where: {
        name: {
          [Op.like]: `%${req.keyword}%`,
        },
        id: { [Op.ne]: id },
        CategoryId: product.CategoryId,
      },
      include: [
        ProductImage,
        {
          model:Shop,
          required:true
        },
        ProductStat,
        ProductReview,
        {
          model: Favorite,
          where: { UserId: req.user.id },
          required: false,
        },
      ],
    });

    childLogger.info("Related products fetched successfully", {
      requestId,
      productId: id,
      CategoryId: product.CategoryId,
      count: response.count,
      page: req.page,
    });
    successResponse(res, {
      count: response.count,
      page: req.page,
      ...response,
    });
  } catch (error) {
    childLogger.error("Failed to fetch related products", {
      requestId,
      productId: req.params.id,
      keyword: req.keyword,
      limit: req.limit,
      offset: req.offset,
      error: error.message,
      stack: error.stack,
    });
    errorResponse(res, error);
  }
};

const getProduct = async (req, res) => {
  const requestId = uuidv4();
  try {
    const user = req.user;
    const { id } = req.params;
    childLogger.http("Received get product request", {
      requestId,
      method: req.method,
      url: req.url,
      params: { id },
      userId: user.id,
    });

    childLogger.info("Fetching product", { requestId, productId: id, userId: user.id });
    const product = await Product.findOne({
      where: { id },
      include: [
        {
          model: CartProduct,
          where: { UserId: user.id },
          required: false,
        },
        ProductImage,
        ProductStat,
        {
          model: ProductReview,
          required: false,
          description: { [Op.ne]: null },
          include: [User],
        },
        {
          model: Shop,
          attributes: {
            include: [
              [
                Sequelize.literal(`
                  EXISTS (
                    SELECT 1
                    FROM "ShopFollowers"
                    WHERE "ShopFollowers"."UserId" = :userId
                    AND "ShopFollowers"."ShopId" = "Shop"."id"
                  )
                `),
                "following",
              ],
            ],
          },
          include: [
            {
              model: ShopFollower,
              where: { UserId: user.id },
              required: false,
            },
          ],
        },
        {
          model: Favorite,
          where: { UserId: user.id },
          required: false,
        },
      ],
      replacements: { userId: user.id },
    });

    if (!product) {
      childLogger.warn("Product not found", { requestId, productId: id, userId: user.id });
      return res.status(404).send({
        status: false,
        message: "Product not found",
      });
    }

    childLogger.info("Product fetched successfully", { requestId, productId: id, userId: user.id });
    successResponse(res, product);
  } catch (error) {
    childLogger.error("Failed to fetch product", {
      requestId,
      productId: req.params.id,
      userId: req.user?.id,
      error: error.message,
      stack: error.stack,
    });
    errorResponse(res, error);
  }
};

const updateProduct = async (req, res) => {
  const requestId = uuidv4();
  try {
    const { id } = req.params;
    childLogger.http("Received update product request", {
      requestId,
      method: req.method,
      url: req.url,
      params: { id },
      body: req.body,
    });

    childLogger.debug("Request body", { requestId, body: req.body });

    childLogger.info("Fetching product for update", { requestId, productId: id });
    const product = await findProductByID(id);

    if (!product) {
      childLogger.warn("Product not found", { requestId, productId: id });
      return res.status(404).send({
        status: false,
        message: "Product not found",
      });
    }

    childLogger.info("Updating product", { requestId, productId: id });
    const response = await product.update({
      ...req.body,
    });

    childLogger.info("Product updated successfully", { requestId, productId: id });
    successResponse(res, response);
  } catch (error) {
    childLogger.error("Failed to update product", {
      requestId,
      productId: req.params.id,
      error: error.message,
      stack: error.stack,
    });
    errorResponse(res, error);
  }
};

const deleteProduct = async (req, res) => {
  const requestId = uuidv4();
  try {
    const { id } = req.params;
    childLogger.http("Received delete product request", {
      requestId,
      method: req.method,
      url: req.url,
      params: { id },
    });

    childLogger.info("Fetching product for deletion", { requestId, productId: id });
    const product = await findProductByID(id);

    if (!product) {
      childLogger.warn("Product not found", { requestId, productId: id });
      return res.status(404).send({
        status: false,
        message: "Product not found",
      });
    }

    childLogger.info("Deleting product", { requestId, productId: id });
    const response = await product.destroy();

    childLogger.info("Product deleted successfully", { requestId, productId: id });
    successResponse(res, response);
  } catch (error) {
    childLogger.error("Failed to delete product", {
      requestId,
      productId: req.params.id,
      error: error.message,
      stack: error.stack,
    });
    errorResponse(res, error);
  }
};

module.exports = {
  findProductByID,
  getProducts,
  addProduct,
  deleteProduct,
  getShopProducts,
  getNewArrivalProducts,
  getProductsForYou,
  getProductSearch,
  getRelatedProducts,
  getProduct,
  updateProduct,
};