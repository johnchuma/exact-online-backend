const redisClient = require("../config/redis");
const logger = require("./logger");

const childLogger = logger.child({ module: "Cache Utils" });

/**
 * Generate cache key for products with query parameters
 */
const generateProductCacheKey = (query, userId = null) => {
  const { category, keyword, limit, offset, page } = query;
  const userPrefix = userId ? `user:${userId}:` : "guest:";

  // Create a normalized key based on query parameters
  const keyParts = [
    "products",
    category && category !== "All" ? `cat:${category}` : "cat:all",
    keyword ? `kw:${keyword}` : "kw:all",
    `limit:${limit || 10}`,
    `offset:${offset || 0}`,
    `page:${page || 1}`,
  ];

  return `${userPrefix}${keyParts.join(":")}`;
};

/**
 * Generate cache key for product details
 */
const generateProductDetailCacheKey = (productId, userId = null) => {
  const userPrefix = userId ? `user:${userId}:` : "guest:";
  return `${userPrefix}product:${productId}`;
};

/**
 * Generate cache key for shop products
 */
const generateShopProductsCacheKey = (shopId, query, userId = null) => {
  const { limit, offset, page } = query;
  const userPrefix = userId ? `user:${userId}:` : "guest:";

  const keyParts = [
    "shop",
    shopId,
    "products",
    `limit:${limit || 10}`,
    `offset:${offset || 0}`,
    `page:${page || 1}`,
  ];

  return `${userPrefix}${keyParts.join(":")}`;
};

/**
 * Generate cache key for new arrival products
 */
const generateNewArrivalCacheKey = (query, userId = null) => {
  const { keyword, limit, offset, page } = query;
  const userPrefix = userId ? `user:${userId}:` : "guest:";

  const keyParts = [
    "products",
    "new-arrivals",
    keyword ? `kw:${keyword}` : "kw:all",
    `limit:${limit || 10}`,
    `offset:${offset || 0}`,
    `page:${page || 1}`,
  ];

  return `${userPrefix}${keyParts.join(":")}`;
};

/**
 * Generate cache key for product search
 */
const generateProductSearchCacheKey = (keyword, userId = null) => {
  const userPrefix = userId ? `user:${userId}:` : "guest:";
  return `${userPrefix}search:products:${keyword.toLowerCase()}`;
};

/**
 * Generate cache key for related products
 */
const generateRelatedProductsCacheKey = (productId, query, userId = null) => {
  const { limit, offset, page } = query;
  const userPrefix = userId ? `user:${userId}:` : "guest:";

  const keyParts = [
    "related",
    "products",
    productId,
    `limit:${limit || 10}`,
    `offset:${offset || 0}`,
    `page:${page || 1}`,
  ];

  return `${userPrefix}${keyParts.join(":")}`;
};
const generateForYouCacheKey = (query, userId) => {
  if (!userId) return null; // Don't cache guest "for you" products

  const { limit, offset, page } = query;

  const keyParts = [
    "products",
    "for-you",
    `limit:${limit || 10}`,
    `offset:${offset || 0}`,
    `page:${page || 1}`,
  ];

  return `user:${userId}:${keyParts.join(":")}`;
};

/**
 * Cache middleware for products endpoints
 */
const cacheMiddleware = (keyGenerator, ttl = 300) => {
  return async (req, res, next) => {
    try {
      const userId = req.user ? req.user.id : null;
      const cacheKey = keyGenerator(req, userId);

      if (!cacheKey) {
        return next();
      }

      const cachedData = await redisClient.get(cacheKey);

      if (cachedData) {
        childLogger.debug("Serving from cache", {
          cacheKey,
          userId: userId || "guest",
        });
        return res.json(cachedData);
      }

      // Store original res.json to intercept response
      const originalJson = res.json;
      res.json = function (data) {
        // Cache the response
        redisClient.set(cacheKey, data, ttl);
        childLogger.debug("Cached response", {
          cacheKey,
          userId: userId || "guest",
          ttl,
        });

        // Call original res.json
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      childLogger.error("Cache middleware error", { error: error.message });
      next(); // Continue without caching
    }
  };
};

/**
 * Invalidate cache patterns when products are modified
 */
const invalidateProductCaches = async (
  productId = null,
  shopId = null,
  categoryId = null
) => {
  try {
    const patterns = [];

    // Invalidate general product caches
    patterns.push("*:products:*");
    patterns.push("*:products");

    // Invalidate specific product cache
    if (productId) {
      patterns.push(`*:product:${productId}`);
    }

    // Invalidate shop-specific caches
    if (shopId) {
      patterns.push(`*:shop:${shopId}:*`);
    }

    // Invalidate category-specific caches
    if (categoryId) {
      patterns.push(`*:products:cat:${categoryId}:*`);
      // Also invalidate general category caches since product counts might change
      patterns.push(`*:categories:*`);
    }

    // Execute invalidation
    for (const pattern of patterns) {
      await redisClient.invalidatePattern(pattern);
    }

    childLogger.info("Product caches invalidated", {
      productId,
      shopId,
      categoryId,
      patterns,
    });
  } catch (error) {
    childLogger.error("Failed to invalidate product caches", {
      error: error.message,
      productId,
      shopId,
      categoryId,
    });
  }
};

// Service cache key generators
/**
 * Generate cache key for services with query parameters
 */
const generateServiceCacheKey = (query, userId = null) => {
  const { category, keyword, limit, offset, page } = query;
  const userPrefix = userId ? `user:${userId}:` : "guest:";

  const keyParts = [
    "services",
    category && category !== "All" ? `cat:${category}` : "cat:all",
    keyword ? `kw:${keyword}` : "kw:all",
    `limit:${limit || 10}`,
    `offset:${offset || 0}`,
    `page:${page || 1}`,
  ];

  return `${userPrefix}${keyParts.join(":")}`;
};

/**
 * Generate cache key for service details
 */
const generateServiceDetailCacheKey = (serviceId, userId = null) => {
  const userPrefix = userId ? `user:${userId}:` : "guest:";
  return `${userPrefix}service:${serviceId}`;
};

/**
 * Generate cache key for shop services
 */
const generateShopServicesCacheKey = (shopId, query, userId = null) => {
  const { limit, offset, page } = query;
  const userPrefix = userId ? `user:${userId}:` : "guest:";

  const keyParts = [
    "shop",
    shopId,
    "services",
    `limit:${limit || 10}`,
    `offset:${offset || 0}`,
    `page:${page || 1}`,
  ];

  return `${userPrefix}${keyParts.join(":")}`;
};

/**
 * Generate cache key for new arrival services
 */
const generateNewArrivalServicesCacheKey = (query, userId = null) => {
  const { keyword, limit, offset, page } = query;
  const userPrefix = userId ? `user:${userId}:` : "guest:";

  const keyParts = [
    "services",
    "new-arrivals",
    keyword ? `kw:${keyword}` : "kw:all",
    `limit:${limit || 10}`,
    `offset:${offset || 0}`,
    `page:${page || 1}`,
  ];

  return `${userPrefix}${keyParts.join(":")}`;
};

/**
 * Generate cache key for services for you (personalized)
 */
const generateServicesForYouCacheKey = (query, userId) => {
  if (!userId) return null; // Don't cache guest "for you" services

  const { limit, offset, page } = query;

  const keyParts = [
    "services",
    "for-you",
    `limit:${limit || 10}`,
    `offset:${offset || 0}`,
    `page:${page || 1}`,
  ];

  return `user:${userId}:${keyParts.join(":")}`;
};

/**
 * Generate cache key for popular services
 */
const generatePopularServicesCacheKey = (query, userId = null) => {
  const { limit, offset, page } = query;
  const userPrefix = userId ? `user:${userId}:` : "guest:";

  const keyParts = [
    "services",
    "popular",
    `limit:${limit || 10}`,
    `offset:${offset || 0}`,
    `page:${page || 1}`,
  ];

  return `${userPrefix}${keyParts.join(":")}`;
};

/**
 * Generate cache key for service search
 */
const generateServiceSearchCacheKey = (keyword, userId = null) => {
  const userPrefix = userId ? `user:${userId}:` : "guest:";
  return `${userPrefix}search:services:${keyword.toLowerCase()}`;
};

/**
 * Generate cache key for related services
 */
const generateRelatedServicesCacheKey = (serviceId, query, userId = null) => {
  const { limit, offset, page } = query;
  const userPrefix = userId ? `user:${userId}:` : "guest:";

  const keyParts = [
    "related",
    "services",
    serviceId,
    `limit:${limit || 10}`,
    `offset:${offset || 0}`,
    `page:${page || 1}`,
  ];

  return `${userPrefix}${keyParts.join(":")}`;
};

/**
 * Invalidate cache patterns when services are modified
 */
const invalidateServiceCaches = async (
  serviceId = null,
  shopId = null,
  categoryId = null
) => {
  try {
    const patterns = [];

    // Invalidate general service caches
    patterns.push("*:services:*");
    patterns.push("*:services");

    // Invalidate specific service cache
    if (serviceId) {
      patterns.push(`*:service:${serviceId}`);
    }

    // Invalidate shop-specific caches
    if (shopId) {
      patterns.push(`*:shop:${shopId}:services:*`);
    }

    // Invalidate category-specific caches
    if (categoryId) {
      patterns.push(`*:services:cat:${categoryId}:*`);
      // Also invalidate general category caches since service counts might change
      patterns.push(`*:categories:*`);
    }

    // Execute invalidation
    for (const pattern of patterns) {
      await redisClient.invalidatePattern(pattern);
    }

    childLogger.info("Service caches invalidated", {
      serviceId,
      shopId,
      categoryId,
      patterns,
    });
  } catch (error) {
    childLogger.error("Failed to invalidate service caches", {
      error: error.message,
      serviceId,
      shopId,
      categoryId,
    });
  }
};

// Category cache key generators
/**
 * Generate cache key for categories with query parameters
 */
const generateCategoryCacheKey = (query, userId = null) => {
  const { type, keyword, limit, offset, page } = query;
  const userPrefix = userId ? `user:${userId}:` : "guest:";

  const keyParts = [
    "categories",
    type ? `type:${type}` : "type:all",
    keyword ? `kw:${keyword}` : "kw:all",
    `limit:${limit || 10}`,
    `offset:${offset || 0}`,
    `page:${page || 1}`,
  ];

  return `${userPrefix}${keyParts.join(":")}`;
};

/**
 * Generate cache key for category details
 */
const generateCategoryDetailCacheKey = (categoryId, userId = null) => {
  const userPrefix = userId ? `user:${userId}:` : "guest:";
  return `${userPrefix}category:${categoryId}`;
};

/**
 * Invalidate cache patterns when categories are modified
 */
const invalidateCategoryCaches = async (
  categoryId = null,
  categoryType = null
) => {
  try {
    const patterns = [];

    // Invalidate general category caches
    patterns.push("*:categories:*");
    patterns.push("*:categories");

    // Invalidate specific category cache
    if (categoryId) {
      patterns.push(`*:category:${categoryId}`);
    }

    // Invalidate type-specific caches
    if (categoryType) {
      patterns.push(`*:categories:type:${categoryType}:*`);
    }

    // Also invalidate related product and service caches since categories affect filtering
    patterns.push("*:products:cat:*");
    patterns.push("*:services:cat:*");

    // Execute invalidation
    for (const pattern of patterns) {
      await redisClient.invalidatePattern(pattern);
    }

    childLogger.info("Category caches invalidated", {
      categoryId,
      categoryType,
      patterns,
    });
  } catch (error) {
    childLogger.error("Failed to invalidate category caches", {
      error: error.message,
      categoryId,
      categoryType,
    });
  }
};

module.exports = {
  generateProductCacheKey,
  generateProductDetailCacheKey,
  generateShopProductsCacheKey,
  generateNewArrivalCacheKey,
  generateForYouCacheKey,
  generateProductSearchCacheKey,
  generateRelatedProductsCacheKey,
  cacheMiddleware,
  invalidateProductCaches,
  generateServiceCacheKey,
  generateServiceDetailCacheKey,
  generateShopServicesCacheKey,
  generateNewArrivalServicesCacheKey,
  generateServicesForYouCacheKey,
  generatePopularServicesCacheKey,
  generateServiceSearchCacheKey,
  generateRelatedServicesCacheKey,
  invalidateServiceCaches,
  generateCategoryCacheKey,
  generateCategoryDetailCacheKey,
  invalidateCategoryCaches,
};
