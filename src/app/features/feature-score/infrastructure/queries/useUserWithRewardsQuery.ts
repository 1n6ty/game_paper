import { useQuery } from "@tanstack/react-query";
import { loadUserWithRewards } from "@/app/features/feature-score/application/usecases/loadUserWithRewards";
import { UserRewardsRepository } from "@/app/features/feature-score/domain/ports/UserRewardsRepository";
import { userFeatureIdentifiers } from "@/app/features/feature-score/userDeps";
import { Logger } from "@/app/shared-kernel/application/ports/Logger";
import { AuthService } from "@/app/shared-kernel/domain/ports/AuthService";
import { sharedIdentifiers } from "@/app/shared-kernel/sharedKernelDeps";
import { useDIContainer } from "@/app/shell/ui/contexts/DIContext";

const userWithRewardsQueryKey = ["userWithRewards"];

export const useUserWithRewardsQuery = () => {
  const di = useDIContainer();

  const logger = di.get<Logger>(sharedIdentifiers.Logger);
  const authService = di.get<AuthService>(sharedIdentifiers.AuthService);
  const userRewardsRepository = di.get<UserRewardsRepository>(
    userFeatureIdentifiers.UserRewardsRepository
  );

  return useQuery({
    queryKey: userWithRewardsQueryKey,
    queryFn: () =>
      loadUserWithRewards({ logger, authService, userRewardsRepository }),
    staleTime: 5 * 60 * 1000, // 5 минут
  });
};
