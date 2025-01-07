const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getProductStats,
  updateProductStat,
  deleteProductStat,
  addProductStat,
  getProductStat,
} = require("./productStats.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addProductStat);
router.get("/", validateJWT, getPagination, getProductStats);
router.get("/:id", validateJWT, getProductStat);
router.patch("/:id", validateJWT, updateProductStat);
router.delete("/:id", validateJWT, deleteProductStat);

module.exports = router;
