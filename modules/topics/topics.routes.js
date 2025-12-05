const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getTopics,
  updateTopic,
  deleteTopic,
  addTopic,
  getTopic,
} = require("./topics.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addTopic);
router.get("/chat/:id", getPagination, getTopics);
router.get("/:id", validateJWT, getTopic);
router.patch("/:id", validateJWT, updateTopic);
router.delete("/:id", validateJWT, deleteTopic);

module.exports = router;
