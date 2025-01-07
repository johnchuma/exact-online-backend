const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getCategories,
  updateProductCategory,
  deleteProductCategory,
  addProductCategory,
  getProductCategory,
} = require("./productCategories.controllers");
const { getPagination } = require("../../utils/getPagination");
const upload = require("../../utils/upload");

const router = Router();

router.post("/", validateJWT, addProductCategory);
router.get("/", validateJWT, getPagination, getCategories);
router.get("/:id", validateJWT, getProductCategory);
router.patch("/:id", validateJWT, updateProductCategory);
router.delete("/:id", validateJWT, deleteProductCategory);

module.exports = router;
