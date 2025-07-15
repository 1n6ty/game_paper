import { AuthService } from "../../../../domain/ports/AuthService";
import { mockUser } from "./mockUser";

export const mockAuthService: AuthService = {
  getAuthData: async () => "MOCK_AUTH_RAW_DATA_STRING",
  getAuthenticatedUser: async () => mockUser,
};
