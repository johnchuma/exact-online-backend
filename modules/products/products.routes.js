const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getProducts,
  updateProduct,
  deleteProduct,
  addProduct,
  getProduct,
  getShopProducts,
  getNewArrivalProducts,
  getProductsForYou,
  getRelatedProducts,
  getProductSearch,
} = require("./products.controllers");
const { getPagination } = require("../../utils/getPagination");
const upload = require("../../utils/upload");

const router = Router();

router.post("/", validateJWT, addProduct);
router.get("/", validateJWT, getPagination, getProducts);
router.get("/new", validateJWT, getPagination, getNewArrivalProducts);
router.get("/search/:keyword", validateJWT, getProductSearch);
router.get("/for-you", validateJWT, getPagination, getProductsForYou);
router.get("/shop/:id", validateJWT, getPagination, getShopProducts);
router.get(
  "/related/product/:id",
  validateJWT,
  getPagination,
  getRelatedProducts
);
router.get("/:id", validateJWT, getProduct);
router.patch("/:id", validateJWT, updateProduct);
router.delete("/:id", validateJWT, deleteProduct);

module.exports = router;
