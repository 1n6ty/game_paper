import { Container } from "inversify";
import { registerDataMatrixFeature } from "@/app/features/feature-datamatrix/dataMatrixDeps";
import { registerGameFeature } from "@/app/features/feature-game/gameDeps";
import { registerUserFeature } from "@/app/features/feature-user/userDeps";
import { registerSharedKernel } from "@/app/shared-kernel/sharedKernelDeps";

export const createBaseDIContainer = (): Container => {
  const container = new Container();

  registerSharedKernel(container);
  registerUserFeature(container);
  registerGameFeature(container);
  registerDataMatrixFeature(container);

  return container;
};
