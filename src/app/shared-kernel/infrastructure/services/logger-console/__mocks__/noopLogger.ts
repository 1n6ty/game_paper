import { Logger } from "@/app/shared-kernel/application/ports/Logger";

export const noopLogger: Logger = {
  info: () => {},
  warn: () => {},
  error: () => {},
  createScope: function () {
    return this;
  },
};
