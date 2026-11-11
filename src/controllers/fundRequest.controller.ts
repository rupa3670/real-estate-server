import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../middleware/auth";
import {
  createFundRequestService,
  getFundRequestsService,
  reviewFundRequestService,
} from "../services/fundRequest.service";

export const createFundRequest = asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;

  const fundRequest = await createFundRequestService(
    req.body,
    authReq.user!.id
  );

  res.status(201).json({ success: true, fundRequest });
});

export const getFundRequests = asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;

  const fundRequests = await getFundRequestsService(
    authReq.user!.id,
    authReq.user!.role
  );

  res.json({ success: true, fundRequests });
});

export const reviewFundRequest = asyncHandler(async (req, res) => {
  const authReq = req as AuthRequest;

  const fundRequest = await reviewFundRequestService(
    req.params.id as string,
    authReq.user!.id,
    req.body
  );

  res.json({ success: true, fundRequest });
});