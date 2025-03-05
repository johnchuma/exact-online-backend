const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  updateCartProduct,
  deleteCartProduct,
  addCartProduct,
  getCartProduct,
  getUserCartProducts,
} = require("./cartProducts.controllers");
const { getPagination } = require("../../utils/getPagination");
const router = Router();

router.post("/", validateJWT, addCartProduct);
router.get("/user/:id", validateJWT, getPagination, getUserCartProducts);
router.get("/:id", validateJWT, getCartProduct);
router.patch("/:id", validateJWT, updateCartProduct);
router.delete("/:id", validateJWT, deleteCartProduct);

module.exports = router;
