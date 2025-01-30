const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getFavorites,
  updateFavorite,
  deleteFavorite,
  addFavorite,
  getFavorite,
  getUserFavorites,
} = require("./favorites.controllers");
const { getPagination } = require("../../utils/getPagination");
const router = Router();

router.post("/", validateJWT, addFavorite);
router.get("/", validateJWT, getPagination, getFavorites);
router.get("/user/:id", validateJWT, getPagination, getUserFavorites);
router.get("/:id", validateJWT, getFavorite);
router.patch("/:id", validateJWT, updateFavorite);
router.delete("/:id", validateJWT, deleteFavorite);

module.exports = router;
