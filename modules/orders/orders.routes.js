const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getOrders,
  updateOrder,
  deleteOrder,
  addOrder,
  getOrder,
} = require("./orders.controllers");
const { getPagination } = require("../../utils/getPagination");
const router = Router();

router.post("/", validateJWT, addOrder);
router.get("/", validateJWT, getPagination, getOrders);
router.get("/:id", validateJWT, getOrder);
router.patch("/:id", validateJWT, updateOrder);
router.delete("/:id", validateJWT, deleteOrder);

module.exports = router;
