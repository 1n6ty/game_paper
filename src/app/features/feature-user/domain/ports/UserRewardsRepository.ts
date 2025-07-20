import { UserRewards } from "@/app/features/feature-user/domain/entities/UserRewards";

export interface UserRewardsRepository {
  getUserRewards(authData: string): Promise<UserRewards>;
}
