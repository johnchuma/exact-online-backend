const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getOrderedProducts,
  updateOrderedProduct,
  deleteOrderedProduct,
  addOrderedProduct,
  getOrderedProduct,
  findOnCartOrderedProducts,
} = require("./orderedProducts.controllers");
const { getPagination } = require("../../utils/getPagination");
const router = Router();

router.post("/", validateJWT, addOrderedProduct);
router.get("/", validateJWT, getPagination, getOrderedProducts);
router.get("/on-cart", validateJWT, getPagination, findOnCartOrderedProducts);
router.get("/:id", validateJWT, getOrderedProduct);
router.patch("/:id", validateJWT, updateOrderedProduct);
router.delete("/:id", validateJWT, deleteOrderedProduct);

module.exports = router;
