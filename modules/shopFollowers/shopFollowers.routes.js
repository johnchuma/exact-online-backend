const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getShopFollowers,
  updateShopFollower,
  deleteShopFollower,
  addShopFollower,
  getShopFollower,
} = require("./shopFollowers.controllers");
const { getPagination } = require("../../utils/getPagination");
const router = Router();

router.post("/", validateJWT, addShopFollower);
router.get("/", validateJWT, getPagination, getShopFollowers);
router.get("/shop/:id", validateJWT, getPagination, getShopFollowers);
router.get("/:id", validateJWT, getShopFollower);
router.patch("/:id", validateJWT, updateShopFollower);
router.delete("/:id", validateJWT, deleteShopFollower);

module.exports = router;
