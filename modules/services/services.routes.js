const { Router } = require("express");
const { validateJWT } = require("../../utils/validateJWT");
const {
  getServices,
  updateService,
  deleteService,
  addService,
  getService,
  getShopServices,
  getNewArrivalServices,
  getServicesForYou,
  getRelatedServices,
  getServiceSearch,
  getPopularServices,
} = require("./services.controllers");
const { getPagination } = require("../../utils/getPagination");

const router = Router();

router.post("/", validateJWT, addService);
router.get("/", validateJWT, getPagination, getServices);
router.get("/new", validateJWT, getPagination, getNewArrivalServices);
router.get("/search/:keyword", validateJWT, getServiceSearch);
router.get("/for-you", validateJWT, getPagination, getServicesForYou);
router.get("/popular", validateJWT, getPagination, getPopularServices);
router.get("/shop/:id", validateJWT, getPagination, getShopServices);
router.get(
  "/related/service/:id",
  validateJWT,
  getPagination,
  getRelatedServices
);
router.get("/:id", validateJWT, getService);
router.patch("/:id", validateJWT, updateService);
router.delete("/:id", validateJWT, deleteService);

module.exports = router;
