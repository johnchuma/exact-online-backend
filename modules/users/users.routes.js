const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getUsers,
  getMyInfo,
  getUserInfo,
  updateUser,
  deleteUser,
  addUser,
  verifyCode,
  sendVerificationCode,
} = require("./users.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", addUser);
router.post("/auth/send-code", sendVerificationCode);
router.post("/auth/verify-code", verifyCode);
router.get("/", validateJWT, getPagination, getUsers);
router.get("/me", validateJWT, getMyInfo);
router.get("/:id", validateJWT, getUserInfo);
router.patch("/:id", validateJWT, updateUser);
router.delete("/:id", validateJWT, deleteUser);

module.exports = router;
