const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getProductImages,
  updateProductImage,
  deleteProductImage,
  addProductImage,
  getProductImage,
} = require("./productImages.controllers");
const { getPagination } = require("../../utils/getPagination");
const upload = require("../../utils/upload");

const router = Router();

router.post("/", validateJWT, upload.single("file"), addProductImage);
router.get("/", validateJWT, getPagination, getProductImages);
router.get("/:id", validateJWT, getProductImage);
router.patch("/:id", validateJWT, updateProductImage);
router.delete("/:id", validateJWT, deleteProductImage);

module.exports = router;
