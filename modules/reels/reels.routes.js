const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getReels,
  updateReel,
  deleteReel,
  addReel,
  getReel,
} = require("./reels.controllers");
const { getPagination } = require("../../utils/getPagination");
const upload = require("../../utils/upload");
const router = Router();

router.post("/", upload.single("file"), validateJWT, addReel);
router.get("/", validateJWT, getPagination, getReels);
router.get("/:id", validateJWT, getReel);
router.patch("/:id", validateJWT, updateReel);
router.delete("/:id", validateJWT, deleteReel);

module.exports = router;
