import { UserRewards } from "@/app/features/feature-score/domain/entities/UserRewards";

export interface UserRewardsRepository {
  getUserRewards(authData: string): Promise<UserRewards>;
}
