import { useQuery } from "@tanstack/react-query";
import { CouponPolicyRepository } from "@/app/features/feature-user/domain/ports/CouponPolicyRepository";
import { userFeatureIdentifiers } from "@/app/features/feature-user/userDeps";
import { useDIContainer } from "@/app/shell/ui/contexts/DIContext";

export const couponPolicyQueryKey = ["couponPolicy"];

export const useCouponPolicyQuery = () => {
  const di = useDIContainer();

  const couponPolicyRepository = di.get<CouponPolicyRepository>(
    userFeatureIdentifiers.CouponPolicyRepository
  );

  return useQuery({
    queryKey: couponPolicyQueryKey,
    queryFn: () => couponPolicyRepository.getCouponPolicy(),

    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};
