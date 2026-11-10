import { User } from "../models/User";

export const getStatsService = async () => {
  const users = await User.countDocuments({
    role: { $in: ["manager", "accountant"] },
    isActive: true,
  });

  return { users };
};