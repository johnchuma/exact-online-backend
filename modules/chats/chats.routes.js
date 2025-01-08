const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getChats,
  updateChat,
  deleteChat,
  addChat,
  getChat,
  getShopChats,
  getUserChats,
} = require("./chats.controllers");
const { getPagination } = require("../../utils/getPagination");
const router = Router();

router.post("/", validateJWT, addChat);
router.get("/", validateJWT, getPagination, getChats);
router.get("/shop/:id", validateJWT, getPagination, getShopChats);
router.get("/user/:id", validateJWT, getPagination, getUserChats);
router.get("/:id", validateJWT, getChat);
router.patch("/:id", validateJWT, updateChat);
router.delete("/:id", validateJWT, deleteChat);

module.exports = router;
