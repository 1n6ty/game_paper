import { ApiConfig } from "@/app/shared-kernel/application/ports/ApiConfig";

export const baseApiConfig: ApiConfig = {
  endpoints: {
    user: {
      rewards: "/score/",
    },
    game: {
      list: "/gamelinks/",
      initialize: "/gameinit/",
      finish: "/gamefinish/",
    },
    datamatrix: {
      scan: "/datamatrix/",
    },
  },
};
