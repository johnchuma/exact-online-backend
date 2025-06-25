const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getShops,
  updateShop,
  deleteShop,
  addShop,
  getShop,
  getUserShops,
  getUserShopFollowings,
} = require("./shops.controllers");
const { getPagination } = require("../../utils/getPagination");
const upload = require("../../utils/upload");

const router = Router();

router.post("/", validateJWT, addShop);
router.get("/",  getPagination, getShops);
router.get("/user/:id",  getPagination, getUserShops);
router.get(
  "/following/user/:id",
  getPagination,
  getUserShopFollowings
);
router.get("/:id",  getShop);
router.patch("/:id", upload.single("file"), validateJWT, updateShop);
router.delete("/:id", validateJWT, deleteShop);

module.exports = router;
