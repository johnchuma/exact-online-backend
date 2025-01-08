const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getCategories,
  updateProductCategory,
  deleteProductCategory,
  addProductCategory,
  getProductCategory,
  getProductCategories,
} = require("./productCategories.controllers");
const { getPagination } = require("../../utils/getPagination");
const upload = require("../../utils/upload");

const router = Router();

router.post("/", validateJWT, addProductCategory);
router.get("/", validateJWT, getPagination, getProductCategories);
router.get("/:id", validateJWT, getProductCategory);
router.patch("/:id", validateJWT, updateProductCategory);
router.delete("/:id", validateJWT, deleteProductCategory);

module.exports = router;
