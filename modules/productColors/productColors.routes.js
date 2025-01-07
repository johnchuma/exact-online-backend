const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getProductColors,
  updateProductColor,
  deleteProductColor,
  addProductColor,
  getProductColor,
} = require("./productColors.controllers");
const { getPagination } = require("../../utils/getPagination");
const upload = require("../../utils/upload");

const router = Router();

router.post("/", validateJWT, addProductColor);
router.get("/", validateJWT, getPagination, getProductColors);
router.get("/:id", validateJWT, getProductColor);
router.patch("/:id", validateJWT, updateProductColor);
router.delete("/:id", validateJWT, deleteProductColor);

module.exports = router;
