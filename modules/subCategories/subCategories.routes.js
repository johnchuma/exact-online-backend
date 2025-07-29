const express = require("express");
const router = express.Router();

const {
  addSubCategory,
  getSubCategories,
  getSubCategory,
  editSubCategory,
  deleteSubCategory,
  getSubCategoriesByCategory,
} = require("./subCategories.controllers");
const { getPagination } = require("../../utils/getPagination");

// Create a new subcategory
router.post("/", addSubCategory);
router.get("/", getPagination, getSubCategories);
router.get("/category/:CategoryId", getSubCategoriesByCategory);
router.get("/:id", getSubCategory);
router.put("/:id", editSubCategory);
router.delete("/:id", deleteSubCategory);

module.exports = router;
