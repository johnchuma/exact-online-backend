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
router.get("/",  getPagination, getServices);
router.get("/new", getPagination, getNewArrivalServices);
router.get("/search/:keyword",  getServiceSearch);
router.get("/for-you",  getPagination, getServicesForYou);
router.get("/popular",  getPagination, getPopularServices);
router.get("/shop/:id",  getPagination, getShopServices);
router.get(
  "/related/service/:id",
  getPagination,
  getRelatedServices
);
router.get("/:id",  getService);
router.patch("/:id", validateJWT, updateService);
router.delete("/:id", validateJWT, deleteService);

module.exports = router;
