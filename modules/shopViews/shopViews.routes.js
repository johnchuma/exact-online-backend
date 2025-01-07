const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getShopViews,
  updateShopView,
  deleteShopView,
  addShopView,
  getShopView,
} = require("./shopViews.controllers");
const { getPagination } = require("../../utils/getPagination");
const router = Router();

router.post("/", validateJWT, addShopView);
router.get("/", validateJWT, getPagination, getShopViews);
router.get("/:id", validateJWT, getShopView);
router.patch("/:id", validateJWT, updateShopView);
router.delete("/:id", validateJWT, deleteShopView);

module.exports = router;
