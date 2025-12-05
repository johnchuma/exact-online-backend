const router = require("express").Router();
const {
  createPOSSale,
  getPOSSales,
  getPOSSale,
  getPOSAnalytics,
  refundPOSSale,
  createPOSSession,
  closePOSSession,
  getPOSSessions,
} = require("./pos.controllers");

// Sales routes
router.post("/sales", createPOSSale);
router.get("/sales", getPOSSales);
router.get("/sales/:id", getPOSSale);
router.post("/sales/:id/refund", refundPOSSale);

// Analytics
router.get("/analytics", getPOSAnalytics);

// Session routes
router.post("/sessions", createPOSSession);
router.get("/sessions", getPOSSessions);
router.patch("/sessions/:id/close", closePOSSession);

module.exports = router;
