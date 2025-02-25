const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getBanners,
  updateBanner,
  deleteBanner,
  addBanner,
  getBanner,
  getShopBanners,
} = require("./banners.controllers");
const { getPagination } = require("../../utils/getPagination");
const upload = require("../../utils/upload");
const router = Router();

router.post("/",upload.single("file"), validateJWT, addBanner);
router.get("/", validateJWT, getPagination, getBanners);
router.get("/:id", validateJWT, getBanner);
router.patch("/:id", validateJWT, updateBanner);
router.delete("/:id", validateJWT, deleteBanner);

module.exports = router;
