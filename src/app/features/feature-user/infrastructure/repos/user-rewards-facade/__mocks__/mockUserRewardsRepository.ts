import { UserRewardsRepository } from "@/app/features/feature-user/domain/ports/UserRewardsRepository";
import { mockUserRewards } from "./mockUserRewards";

export const mockUserRewardsRepository: UserRewardsRepository = {
  getUserRewards: async () => mockUserRewards,
};
