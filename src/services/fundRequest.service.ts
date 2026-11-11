
import mongoose from "mongoose";
import { FundRequest } from "../models/FundRequest";
import { ApiError } from "../utils/ApiError";
import { Project } from "../models/Projects";

const approvedStatuses = [
  "approved",
  "processing",
  "partially_paid",
  "paid",
] as const;

export const createFundRequestService = async (
  data: { project: string; amount: number; reason: string },
  managerId: string
) => {
  const { project, amount, reason } = data;

  if (!project || amount === undefined || !reason?.trim()) {
    throw new ApiError(400, "Project, amount and reason are required");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new ApiError(400, "Amount must be a number greater than 0");
  }

  if (!mongoose.isValidObjectId(project)) {
    throw new ApiError(400, "Invalid project id");
  }

  const projectDoc = await Project.findById(project);

  if (!projectDoc) {
    throw new ApiError(404, "Project not found");
  }

  if (projectDoc.manager.toString() !== managerId) {
    throw new ApiError(403, "This is not your project");
  }

  const earlier = await FundRequest.find({
    project,
    status: { $in: approvedStatuses },
  });


  const alreadyApproved = earlier.reduce(
    (sum, r) => sum + (r.approvedAmount ?? 0),
    0
  );

 
  const isOverBudget =
    alreadyApproved + amount > projectDoc.estimatedBudget;

  const fundRequest = await FundRequest.create({
    project,
    requestedBy: managerId,
    amount,
    reason: reason.trim(),
    isOverBudget,
  });

  return fundRequest;
};

export const getFundRequestsService = async (
  userId: string,
  role: string
) => {
  const filter = role === "manager" ? { requestedBy: userId } : {};

  return FundRequest.find(filter)
    .populate("project", "name estimatedBudget")
    .populate("requestedBy", "name")
    .sort({ createdAt: -1 });
};

export const reviewFundRequestService = async (
  id: string,
  reviewerId: string,
  data: {
    action: string;
    approvedAmount?: number;
    note?: string;
  }
) => {
  const { action, approvedAmount, note } = data;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid request id");
  }


  if (!["approve", "reject", "changes"].includes(action)) {
    throw new ApiError(
      400,
      "Action must be approve, reject or changes"
    );
  }


  const fundRequest = await FundRequest.findById(id);

  if (!fundRequest) {
    throw new ApiError(404, "Fund request not found");
  }

  if (fundRequest.status !== "pending") {
    throw new ApiError(400, "Only pending requests can be reviewed");
  }

  if (action === "approve") {
    
    const finalAmount = approvedAmount ?? fundRequest.amount;

    if (!Number.isFinite(finalAmount) || finalAmount <= 0) {
      throw new ApiError(
        400,
        "Approved amount must be greater than 0"
      );
    }

    if (finalAmount > fundRequest.amount) {
      throw new ApiError(
        400,
        "Approved amount cannot exceed requested amount"
      );
    }

    fundRequest.status = "approved";
    fundRequest.approvedAmount = finalAmount;
  } else {
   
    if (!note?.trim()) {
      throw new ApiError(400, "Note is required");
    }

    fundRequest.status =
      action === "reject" ? "rejected" : "changes_requested";
  }

  
  fundRequest.reviewedBy = new mongoose.Types.ObjectId(reviewerId);
  fundRequest.reviewNote = note?.trim();

  await fundRequest.save();

  return fundRequest;
};
