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
  resetShopPassword,
} = require("./shops.controllers");
const { getPagination } = require("../../utils/getPagination");
const upload = require("../../utils/upload");

const router = Router();

router.post("/", validateJWT, addShop);
router.get("/", validateJWT, getPagination, getShops);
router.patch("/reset-password/:id", validateJWT, resetShopPassword);
router.get("/user/:id", validateJWT, getPagination, getUserShops);
router.get(
  "/following/user/:id",
  validateJWT,
  getPagination,
  getUserShopFollowings
);
router.get("/:id", validateJWT, getShop);
router.patch("/:id", upload.single("file"), validateJWT, updateShop);
router.delete("/:id", validateJWT, deleteShop);

module.exports = router;
