const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getAds,
  updateAd,
  deleteAd,
  addAd,
  getAd,
  getShopAds,
} = require("./ads.controllers");
const { getPagination } = require("../../utils/getPagination");
const router = Router();

router.post("/", validateJWT, addAd);
router.get("/", validateJWT, getPagination, getAds);
router.get("/shop/:id", validateJWT, getPagination, getShopAds);
router.get("/:id", validateJWT, getAd);
router.patch("/:id", validateJWT, updateAd);
router.delete("/:id", validateJWT, deleteAd);

module.exports = router;
