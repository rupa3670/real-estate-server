import mongoose from "mongoose";
import { Payment } from "../models/Payment";
import { FundRequest } from "../models/FundRequest";
import { ApiError } from "../utils/ApiError";

const payableStatuses = ["approved", "processing", "partially_paid"];

export const createPaymentService = async (
  data: { fundRequest: string; amount: number; note?: string },
  accountantId: string
) => {
  const { fundRequest, amount, note } = data;

  if (!fundRequest || amount === undefined) {
    throw new ApiError(400, "Fund request and amount are required");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new ApiError(400, "Amount must be a number greater than 0");
  }

  if (!mongoose.isValidObjectId(fundRequest)) {
    throw new ApiError(400, "Invalid fund request id");
  }

  const request = await FundRequest.findById(fundRequest);
  if (!request) {
    throw new ApiError(404, "Fund request not found");
  }

  if (request.status === "paid") {
    throw new ApiError(400, "This request is already fully paid");
  }

  if (!payableStatuses.includes(request.status)) {
    throw new ApiError(400, "Only approved requests can be paid");
  }

  const earlier = await Payment.find({ fundRequest: request._id, type: "fund" });
  const alreadyPaid = earlier.reduce((sum, p) => sum + p.amount, 0);
  const due = request.approvedAmount - alreadyPaid;

  if (amount > due) {
    throw new ApiError(400, `Amount exceeds due amount (${due})`);
  }

  const payment = await Payment.create({
    type: "fund",
    fundRequest: request._id,
    amount,
    paidBy: accountantId,
    note: note?.trim(),
  });

  const paidTotal = alreadyPaid + amount;
  request.status = paidTotal >= request.approvedAmount ? "paid" : "partially_paid";
  await request.save();

  return {
    payment,
    paidTotal,
    due: request.approvedAmount - paidTotal,
    status: request.status,
  };
};

export const getPaymentsService = async (fundRequestId?: string) => {
  const filter: Record<string, unknown> = {};

  if (fundRequestId) {
    if (!mongoose.isValidObjectId(fundRequestId)) {
      throw new ApiError(400, "Invalid fund request id");
    }
    filter.fundRequest = fundRequestId;
  }

  return Payment.find(filter)
    .populate("fundRequest", "amount approvedAmount status")
    .populate("paidBy", "name")
    .sort({ createdAt: -1 });
};