const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getProducts,
  updateProduct,
  deleteProduct,
  addProduct,
  getProduct,
  getShopProducts,
  getNewArrivalProducts,
  getProductsForYou,
  getRelatedProducts,
  getProductSearch,
} = require("./products.controllers");
const { getPagination } = require("../../utils/getPagination");
const {
  cacheMiddleware,
  generateProductCacheKey,
  generateProductDetailCacheKey,
  generateShopProductsCacheKey,
  generateNewArrivalCacheKey,
  generateForYouCacheKey,
  generateProductSearchCacheKey,
  generateRelatedProductsCacheKey,
} = require("../../utils/cache");
const upload = require("../../utils/upload");

const router = Router();

// Cache middleware generators
const productsCacheMiddleware = cacheMiddleware(
  (req, userId) => generateProductCacheKey(req.query, userId),
  300
);

const productDetailCacheMiddleware = cacheMiddleware(
  (req, userId) => generateProductDetailCacheKey(req.params.id, userId),
  600
);

const shopProductsCacheMiddleware = cacheMiddleware(
  (req, userId) =>
    generateShopProductsCacheKey(req.params.id, req.query, userId),
  300
);

const newArrivalCacheMiddleware = cacheMiddleware(
  (req, userId) => generateNewArrivalCacheKey(req.query, userId),
  300
);

const forYouCacheMiddleware = cacheMiddleware(
  (req, userId) => generateForYouCacheKey(req.query, userId),
  180
); // Shorter TTL for personalized content

const searchCacheMiddleware = cacheMiddleware(
  (req, userId) => generateProductSearchCacheKey(req.params.keyword, userId),
  600
);

const relatedProductsCacheMiddleware = cacheMiddleware(
  (req, userId) =>
    generateRelatedProductsCacheKey(req.params.id, req.query, userId),
  600
);

router.post("/", validateJWT, addProduct);
router.get(
  "/",
  validateJWT,
  getPagination,
  productsCacheMiddleware,
  getProducts
);
router.get(
  "/new",
  validateJWT,
  getPagination,
  newArrivalCacheMiddleware,
  getNewArrivalProducts
);
router.get(
  "/search/:keyword",
  validateJWT,
  searchCacheMiddleware,
  getProductSearch
);
router.get(
  "/for-you",
  validateJWT,
  getPagination,
  forYouCacheMiddleware,
  getProductsForYou
);
router.get(
  "/shop/:id",
  validateJWT,
  getPagination,
  shopProductsCacheMiddleware,
  getShopProducts
);
router.get(
  "/related/product/:id",
  validateJWT,
  getPagination,
  relatedProductsCacheMiddleware,
  getRelatedProducts
);
router.get("/:id", validateJWT, productDetailCacheMiddleware, getProduct);
router.patch("/:id", validateJWT, updateProduct);
router.delete("/:id", validateJWT, deleteProduct);

module.exports = router;
