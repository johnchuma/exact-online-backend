const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  updateMessage,
  deleteMessage,
  addMessage,
  getMessage,
  markAsReadShopMessage,
  markAsReadUserMessage,
  getTopicMessages,
} = require("./messages.controllers");
const { getPagination } = require("../../utils/getPagination");
const upload = require("../../utils/upload");
const router = Router();

router.post("/", validateJWT, addMessage);
router.get("/topic/:id", validateJWT, getTopicMessages);
router.get("/:id", validateJWT, getMessage);
router.patch("/:id", validateJWT, updateMessage);
router.patch("/mark-as-read/shop/:id", validateJWT, markAsReadShopMessage);
router.patch("/mark-as-read/user/:id", validateJWT, markAsReadUserMessage);
router.delete("/:id", validateJWT, deleteMessage);

module.exports = router;
