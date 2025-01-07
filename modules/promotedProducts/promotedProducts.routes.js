const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getPromotedProducts,
  updatePromotedProduct,
  deletePromotedProduct,
  addPromotedProduct,
  getPromotedProduct,
} = require("./promotedProducts.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addPromotedProduct);
router.get("/", validateJWT, getPagination, getPromotedProducts);
router.get("/:id", validateJWT, getPromotedProduct);
router.patch("/:id", validateJWT, updatePromotedProduct);
router.delete("/:id", validateJWT, deletePromotedProduct);

module.exports = router;
