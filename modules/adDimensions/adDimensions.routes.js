const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getAdDimensions,
  updateAdDimension,
  deleteAdDimension,
  addAdDimension,
  getAdDimension,
} = require("./adDimensions.controllers");
const { getPagination } = require("../../utils/getPagination");
const router = Router();

router.post("/", validateJWT, addAdDimension);
router.get("/", validateJWT, getPagination, getAdDimensions);
router.get("/:id", validateJWT, getAdDimension);
router.patch("/:id", validateJWT, updateAdDimension);
router.delete("/:id", validateJWT, deleteAdDimension);

module.exports = router;
