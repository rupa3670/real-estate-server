import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["fund", "engineer_salary", "mason_wage", "stripe"],
            required: true,
        },
        fundRequest: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "FundRequest"
        },
        engineer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Engineer"
        },
        mason: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Mason"
        },
        month: { type: String },
        amount: {
            type: Number,
            required: true,
            min: [1, "Amount must be greater than 0"]
        },
        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", required: true
        },
        paidAt: {
            type: Date,
            default: Date.now
        },
        note: {
            type: String,
            trim: true
        },
        stripeId: {
            type: String
        },
        stripeStatus: {
            type: String
        },
    },
    { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);