import { apiRequest } from "@/app/components/lib/api";

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "user";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export const getUserProfile = (
  token: string,
): Promise<UserProfileResponse> => {
  return apiRequest<UserProfileResponse>("/auth/user/profile", {
    method: "GET",
    token,
  });
};

export const updateUserProfile = (
  token: string,
  name: string,
): Promise<UpdateProfileResponse> => {
  return apiRequest<UpdateProfileResponse>("/auth/user/profile", {
    method: "PATCH",
    token,
    body: JSON.stringify({ name }),
  });
};

export const changeUserPassword = (
  token: string,
  currentPassword: string,
  newPassword: string,
): Promise<ChangePasswordResponse> => {
  return apiRequest<ChangePasswordResponse>(
    "/auth/user/profile/password",
    {
      method: "PATCH",
      token,
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    },
  );
};