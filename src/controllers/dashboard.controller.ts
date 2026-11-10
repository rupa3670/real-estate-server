import { asyncHandler } from "../utils/asyncHandler";
import { getStatsService } from "../services/dashboard.service";

export const getStats = asyncHandler(async (_req, res) => {
  const stats = await getStatsService();
  res.json({ success: true, stats });
});