import { Router } from "express";
import { auth, authorize } from "../middleware/auth";
import {
  createFundRequest,
  getFundRequests,
  reviewFundRequest,
} from "../controllers/fundRequest.controller";

const router = Router();

router.post("/", auth, authorize("manager"), createFundRequest);
router.get("/", auth, authorize("manager", "accountant", "admin"), getFundRequests);
router.patch("/:id/review", auth, authorize("accountant"), reviewFundRequest);

export default router;