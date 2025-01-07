const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getShopSubscriptions,
  updateShopSubscription,
  deleteShopSubscription,
  addShopSubscription,
  getShopSubscription,
} = require("./shopSubscriptions.controllers");
const { getPagination } = require("../../utils/getPagination");
const upload = require("../../utils/upload");

const router = Router();

router.post("/", validateJWT, addShopSubscription);
router.get("/", validateJWT, getPagination, getShopSubscriptions);
router.get("/:id", validateJWT, getShopSubscription);
router.patch("/:id", validateJWT, updateShopSubscription);
router.delete("/:id", validateJWT, deleteShopSubscription);

module.exports = router;
