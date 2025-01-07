const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getShopCalenders,
  updateShopCalender,
  deleteShopCalender,
  addShopCalender,
  getShopCalender,
} = require("./shopCalenders.controllers");
const { getPagination } = require("../../utils/getPagination");
const upload = require("../../utils/upload");

const router = Router();

router.post("/", validateJWT, addShopCalender);
router.get("/", validateJWT, getPagination, getShopCalenders);
router.get("/:id", validateJWT, getShopCalender);
router.patch("/:id", validateJWT, updateShopCalender);
router.delete("/:id", validateJWT, deleteShopCalender);

module.exports = router;
