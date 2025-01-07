const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getCategoryProductSpecifications,
  updateCategoryProductSpecification,
  deleteCategoryProductSpecification,
  addCategoryProductSpecification,
  getCategoryProductSpecification,
} = require("./categoryProductSpecifications.controllers");
const { getPagination } = require("../../utils/getPagination");
const router = Router();

router.post("/", validateJWT, addCategoryProductSpecification);
router.get("/", validateJWT, getPagination, getCategoryProductSpecifications);
router.get("/:id", validateJWT, getCategoryProductSpecification);
router.patch("/:id", validateJWT, updateCategoryProductSpecification);
router.delete("/:id", validateJWT, deleteCategoryProductSpecification);

module.exports = router;
