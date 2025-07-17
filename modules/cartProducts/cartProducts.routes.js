const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  updateCartProduct,
  deleteCartProduct,
  addCartProduct,
  getCartProduct,
  getUserCartProducts,
} = require("./cartProducts.controllers");
const {
  addCartService,
  getUserCartServices,
  removeCartService,
} = require("./cartServices.controllers");
const { getPagination } = require("../../utils/getPagination");
const router = Router();

// Product cart routes
router.post("/", validateJWT, addCartProduct);
router.get("/user/:id", validateJWT, getPagination, getUserCartProducts);
router.get("/:id", validateJWT, getCartProduct);
router.patch("/:id", validateJWT, updateCartProduct);
router.delete("/:id", validateJWT, deleteCartProduct);

// Service cart routes
router.post("/services", validateJWT, addCartService);
router.get(
  "/services/user/:id",
  validateJWT,
  getPagination,
  getUserCartServices
);
router.delete("/services/:id", validateJWT, removeCartService);

module.exports = router;
