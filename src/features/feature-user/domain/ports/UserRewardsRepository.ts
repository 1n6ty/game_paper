import { UserRewards } from "../entities/UserRewards";

export interface UserRewardsRepository {
  getUserRewards(authData: string): Promise<UserRewards>;
}
