const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getCategories,
  updateCategory,
  deleteCategory,
  addCategory,
  getCategory,
} = require("./categories.controllers");
const { getPagination } = require("../../utils/getPagination");
const upload = require("../../utils/upload");

const router = Router();

router.post("/", validateJWT, upload.single("file"), addCategory);
router.get("/", validateJWT, getPagination, getCategories);
router.get("/:id", validateJWT, getCategory);
router.patch("/:id", validateJWT, upload.single("file"), updateCategory);
router.delete("/:id", validateJWT, deleteCategory);

module.exports = router;
