import { UserRewardsRepository } from "@/app/features/feature-score/domain/ports/UserRewardsRepository";
import { mockUserRewards } from "./mockUserRewards";

export const mockUserRewardsRepository: UserRewardsRepository = {
  getUserRewards: async () => mockUserRewards,
};
