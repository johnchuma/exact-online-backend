const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  updateMessage,
  deleteMessage,
  addMessage,
  getMessage,
  getTopicMessages,
} = require("./messages.controllers");
const { getPagination } = require("../../utils/getPagination");
const upload = require("../../utils/upload");
const router = Router();

router.post("/", validateJWT, addMessage);
router.get("/topic/:id", validateJWT, getTopicMessages);
router.get("/:id", validateJWT, getMessage);
router.patch("/:id", validateJWT, updateMessage);
router.delete("/:id", validateJWT, deleteMessage);

module.exports = router;
