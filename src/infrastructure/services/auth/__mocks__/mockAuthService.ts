import { TelegramUser } from "../../../../domain/entities/user";
import { IAuthService } from "../../../../domain/ports/IServices";

const mockAuthService: IAuthService = {
  getAuthData: async () => {
    console.log("MOCK: [AuthService] getAuthData called");
    return "MOCK_AUTH_RAW_DATA_STRING";
  },
  getPlatformUser: async () => {
    console.log("MOCK: [AuthService] getPlatformUser called");
    const mockUser: TelegramUser = { id: 12345, username: "mock_user", first_name: "Mock" };
    return mockUser;
  },
};

export default mockAuthService;