const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getCategories,
  updateCategory,
  deleteCategory,
  addCategory,
  getCategory,
} = require("./categories.controllers");
const { getPagination } = require("../../utils/getPagination");
const {
  cacheMiddleware,
  generateCategoryCacheKey,
  generateCategoryDetailCacheKey,
} = require("../../utils/cache");
const upload = require("../../utils/upload");

const router = Router();

// Cache middleware generators for categories
const categoriesCacheMiddleware = cacheMiddleware(
  (req, userId) => generateCategoryCacheKey(req.query, userId),
  600
); // Categories don't change often, longer TTL

const categoryDetailCacheMiddleware = cacheMiddleware(
  (req, userId) => generateCategoryDetailCacheKey(req.params.id, userId),
  1200
); // Individual categories are very stable, even longer TTL

router.post("/", validateJWT, upload.single("file"), addCategory);
router.get("/", getPagination, getCategories);
router.get("/:id", categoryDetailCacheMiddleware, getCategory);
router.patch("/:id", validateJWT, upload.single("file"), updateCategory);
router.delete("/:id", validateJWT, deleteCategory);

module.exports = router;
