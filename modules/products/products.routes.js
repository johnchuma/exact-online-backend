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
router.get("/", getPagination, getProducts);
router.get("/new",  getPagination, getNewArrivalProducts);
router.get("/search/:keyword",  getProductSearch);
router.get("/for-you",  getPagination, getProductsForYou);
router.get("/shop/:id", getPagination, getShopProducts);
router.get(
  "/related/product/:id",
  getPagination,
  getRelatedProducts
);
router.get("/:id",  getProduct);
router.patch("/:id", validateJWT, updateProduct);
router.delete("/:id", validateJWT, deleteProduct);

module.exports = router;
