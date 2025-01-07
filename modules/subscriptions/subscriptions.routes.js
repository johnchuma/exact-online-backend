const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getSubscriptions,
  updateSubscription,
  deleteSubscription,
  addSubscription,
  getSubscription,
} = require("./subscriptions.controllers");
const { getPagination } = require("../../utils/getPagination");
const router = Router();

router.post("/", validateJWT, addSubscription);
router.get("/", validateJWT, getPagination, getSubscriptions);
router.get("/:id", validateJWT, getSubscription);
router.patch("/:id", validateJWT, updateSubscription);
router.delete("/:id", validateJWT, deleteSubscription);

module.exports = router;
