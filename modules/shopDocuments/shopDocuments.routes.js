const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getShopDocuments,
  updateShopDocument,
  deleteShopDocument,
  addShopDocument,
  getShopDocument,
} = require("./shopDocuments.controllers");
const { getPagination } = require("../../utils/getPagination");
const upload = require("../../utils/upload");

const router = Router();

router.post("/", upload.single("file"), validateJWT, addShopDocument);
router.get("/", validateJWT, getPagination, getShopDocuments);
router.get("/:id", validateJWT, getShopDocument);
router.patch("/:id", validateJWT, updateShopDocument);
router.delete("/:id", validateJWT, deleteShopDocument);

module.exports = router;
