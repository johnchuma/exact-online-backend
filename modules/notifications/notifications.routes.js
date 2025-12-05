const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
    getNotifications,
    getSingleNotification,
    addNotification,
    updateNotification,
    deleteNotification,
    updateUnreadNotifications,
    getUnreadNotifications,
} = require("./notifications.controllers");
const { getPagination } = require("../../utils/getPagination");
const router = Router();

router.post("/", addNotification);
router.get("/",  getPagination,validateJWT, getNotifications);
router.get("/unread",  getPagination,validateJWT, getUnreadNotifications);
router.get("/:id", validateJWT, getSingleNotification);
router.patch("/unread", validateJWT, updateUnreadNotifications);
router.delete("/:id", validateJWT, deleteNotification);

module.exports = router;
