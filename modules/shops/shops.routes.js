const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getShops,
  updateShop,
  deleteShop,
  addShop,
  getShop,
} = require("./shops.controllers");
const { getPagination } = require("../../utils/getPagination");
const upload = require("../../utils/upload");

const router = Router();

router.post("/", validateJWT, addShop);
router.get("/", validateJWT, getPagination, getShops);
router.get("/:id", validateJWT, getShop);
router.patch("/:id", validateJWT, updateShop);
router.delete("/:id", validateJWT, deleteShop);

module.exports = router;
