import { Container } from "inversify";
import { registerMockDataMatrixFeature } from "@/app/features/feature-datamatrix/mockDatamatrixDeps";
import { registerMockGameFeature } from "@/app/features/feature-game/mockGameDeps";
import { registerMockUserFeature } from "@/app/features/feature-user/mockUserDeps";
import { registerMockSharedKernel } from "@/app/shared-kernel/mockSharedKernelDeps";

export const createMockDIContainer = (): Container => {
  const container = new Container();

  registerMockSharedKernel(container);
  registerMockUserFeature(container);
  registerMockGameFeature(container);
  registerMockDataMatrixFeature(container);

  return container;
};
