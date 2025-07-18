const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getServices,
  updateService,
  deleteService,
  addService,
  getService,
  getShopServices,
  getNewArrivalServices,
  getServicesForYou,
  getRelatedServices,
  getServiceSearch,
  getPopularServices,
} = require("./services.controllers");
const { getPagination } = require("../../utils/getPagination");
const {
  cacheMiddleware,
  generateServiceCacheKey,
  generateServiceDetailCacheKey,
  generateShopServicesCacheKey,
  generateNewArrivalServicesCacheKey,
  generateServicesForYouCacheKey,
  generatePopularServicesCacheKey,
  generateServiceSearchCacheKey,
  generateRelatedServicesCacheKey,
} = require("../../utils/cache");

const router = Router();

// Cache middleware generators for services
const servicesCacheMiddleware = cacheMiddleware(
  (req, userId) => generateServiceCacheKey(req.query, userId),
  300
);

const serviceDetailCacheMiddleware = cacheMiddleware(
  (req, userId) => generateServiceDetailCacheKey(req.params.id, userId),
  600
);

const shopServicesCacheMiddleware = cacheMiddleware(
  (req, userId) =>
    generateShopServicesCacheKey(req.params.id, req.query, userId),
  300
);

const newArrivalServicesCacheMiddleware = cacheMiddleware(
  (req, userId) => generateNewArrivalServicesCacheKey(req.query, userId),
  300
);

const servicesForYouCacheMiddleware = cacheMiddleware(
  (req, userId) => generateServicesForYouCacheKey(req.query, userId),
  180
); // Shorter TTL for personalized content

const popularServicesCacheMiddleware = cacheMiddleware(
  (req, userId) => generatePopularServicesCacheKey(req.query, userId),
  300
);

const serviceSearchCacheMiddleware = cacheMiddleware(
  (req, userId) => generateServiceSearchCacheKey(req.params.keyword, userId),
  600
);

const relatedServicesCacheMiddleware = cacheMiddleware(
  (req, userId) =>
    generateRelatedServicesCacheKey(req.params.id, req.query, userId),
  600
);

router.post("/", validateJWT, addService);
router.get(
  "/",
  validateJWT,
  getPagination,
  servicesCacheMiddleware,
  getServices
);
router.get(
  "/new",
  validateJWT,
  getPagination,
  newArrivalServicesCacheMiddleware,
  getNewArrivalServices
);
router.get(
  "/search/:keyword",
  validateJWT,
  serviceSearchCacheMiddleware,
  getServiceSearch
);
router.get(
  "/for-you",
  validateJWT,
  getPagination,
  servicesForYouCacheMiddleware,
  getServicesForYou
);
router.get(
  "/popular",
  validateJWT,
  getPagination,
  popularServicesCacheMiddleware,
  getPopularServices
);
router.get(
  "/shop/:id",
  validateJWT,
  getPagination,
  shopServicesCacheMiddleware,
  getShopServices
);
router.get(
  "/related/service/:id",
  validateJWT,
  getPagination,
  relatedServicesCacheMiddleware,
  getRelatedServices
);
router.get("/:id", validateJWT, serviceDetailCacheMiddleware, getService);
router.patch("/:id", validateJWT, updateService);
router.delete("/:id", validateJWT, deleteService);

module.exports = router;
