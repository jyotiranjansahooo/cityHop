import { getCurrentUser, type AuthUser } from "./auth";

export interface DashboardUserResponse {
  success: boolean;
  user: AuthUser;
}

export const getDashboardUser = (
  token: string,
): Promise<DashboardUserResponse> => {
  return getCurrentUser(token);
};