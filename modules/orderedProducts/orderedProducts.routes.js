const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getOrderedProducts,
  updateOrderedProduct,
  deleteOrderedProduct,
  addOrderedProduct,
  getOrderedProduct,
  findOnCartOrderedProducts,
  findOrderProducts,
  findOrderProductsByUser,
  findOrderProductsByShop,
} = require("./orderedProducts.controllers");
const { getPagination } = require("../../utils/getPagination");
const router = Router();

router.post("/", validateJWT, addOrderedProduct);
router.get("/", validateJWT, getPagination, getOrderedProducts);
router.get("/on-cart", validateJWT, getPagination, findOnCartOrderedProducts);
router.get("/order/:id", validateJWT, getPagination, findOrderProductsByUser);
router.get("/order/:id/:shopId", validateJWT, getPagination, findOrderProductsByShop);
router.get("/:id", validateJWT, getOrderedProduct);
router.patch("/:id", validateJWT, updateOrderedProduct);
router.delete("/:id", validateJWT, deleteOrderedProduct);

module.exports = router;
