import mongoose from "mongoose";

const fundRequestSchema = new mongoose.Schema(
    {
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true
        },
        requestedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", required: true
        },
        amount: {
            type: Number,
            required: true,
            min: [1, "Amount must be greater than 0"]
        },
        reason: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ["pending", "changes_requested", "approved", "rejected", "processing", "partially_paid", "paid"],
            default: "pending",
        },
        approvedAmount: {
            type: Number,
            default: 0,
            min: 0
        },
        isOverBudget: {
            type: Boolean,
            default: false
        },
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        reviewNote: {
            type: String,
            trim: true
        },
    },
    { timestamps: true }
);

export const FundRequest = mongoose.model("FundRequest", fundRequestSchema);