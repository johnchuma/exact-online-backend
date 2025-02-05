const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getReelStats,
  updateReelStat,
  deleteReelStat,
  addReelStat,
  getReelStat,
} = require("./reelStats.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addReelStat);
router.get("/", validateJWT, getPagination, getReelStats);
router.get("/:id", validateJWT, getReelStat);
router.patch("/:id", validateJWT, updateReelStat);
router.delete("/:id", validateJWT, deleteReelStat);

module.exports = router;
