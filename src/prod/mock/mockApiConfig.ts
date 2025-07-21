import { ApiConfig } from "@/app/shared-kernel/application/ports/ApiConfig";

export const mockApiConfig: ApiConfig = {
  endpoints: {
    user: {
      rewards: "REWARD_URL",
    },
    game: {
      list: "GAME_LIST_URL",
      initialize: "GAME_INIT_URL",
      finish: "GAME_FINISH_URL",
    },
    datamatrix: {
      scan: "SCAN_URL",
    },
  },
};
