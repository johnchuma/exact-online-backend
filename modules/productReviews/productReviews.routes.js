const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getProductReviews,
  updateProductReview,
  deleteProductReview,
  addProductReview,
  getProductReview,
} = require("./productReviews.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addProductReview);
router.get("/", validateJWT, getPagination, getProductReviews);
router.get("/:id", validateJWT, getProductReview);
router.patch("/:id", validateJWT, updateProductReview);
router.delete("/:id", validateJWT, deleteProductReview);

module.exports = router;
