const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getServiceImages,
  updateServiceImage,
  deleteServiceImage,
  addServiceImage,
  getServiceImage,
} = require("./serviceImages.controllers");
const { getPagination } = require("../../utils/getPagination");
const upload = require("../../utils/upload");
const router = Router();

router.post("/", validateJWT, upload.single("file"), addServiceImage);
router.get("/", validateJWT, getPagination, getServiceImages);
router.get("/:id", validateJWT, getServiceImage);
router.patch("/:id", validateJWT, updateServiceImage);
router.delete("/:id", validateJWT, deleteServiceImage);

module.exports = router;
