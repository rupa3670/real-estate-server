import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../middleware/auth";
import {
  createPaymentService,
  getPaymentsService,
} from "../services/payment.service";

export const createPayment = asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;

  const result = await createPaymentService(req.body, authReq.user!.id);

  res.status(201).json({ success: true, ...result });
});

export const getPayments = asyncHandler(async (req, res) => {
  const fundRequestId = req.query.fundRequest as string | undefined;

  const payments = await getPaymentsService(fundRequestId);

  res.json({ success: true, payments });
});