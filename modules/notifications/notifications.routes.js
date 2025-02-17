const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
    getNotifications,
    getSingleNotification,
    addNotification,
    updateNotification,
    deleteNotification,
} = require("./notifications.controllers");
const { getPagination } = require("../../utils/getPagination");
const router = Router();

router.post("/", validateJWT, addNotification);
router.get("/", validateJWT, getPagination, getNotifications);
router.get("/:id", validateJWT, getSingleNotification);
router.patch("/:id", validateJWT, updateNotification);
router.delete("/:id", validateJWT, deleteNotification);

module.exports = router;
