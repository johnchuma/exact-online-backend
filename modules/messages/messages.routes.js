const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getMessages,
  updateMessage,
  deleteMessage,
  addMessage,
  getMessage,
} = require("./messages.controllers");
const { getPagination } = require("../../utils/getPagination");
const upload = require("../../utils/upload");
const router = Router();

router.post("/", upload.single("file"), validateJWT, addMessage);
router.get("/", validateJWT, getPagination, getMessages);
router.get("/:id", validateJWT, getMessage);
router.patch("/:id", validateJWT, updateMessage);
router.delete("/:id", validateJWT, deleteMessage);

module.exports = router;
