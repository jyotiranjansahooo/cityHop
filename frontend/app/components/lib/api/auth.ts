import { apiRequest } from "../../lib/api";

export type UserRole = "user" | "owner" | "admin";

export interface AuthUser {
id: string;
name: string;
email: string;
role: UserRole;
isActive: boolean;
createdAt?: string;
}

export interface RegisterData {
name: string;
email: string;
password: string;
}

export interface LoginData {
email: string;
password: string;
}

export interface AuthResponse {
success: boolean;
message: string;
token?: string;
user: AuthUser;
}

export const registerUser = (
data: RegisterData,
): Promise<AuthResponse> => {
return apiRequest<AuthResponse>("/auth/register", {
method: "POST",
body: JSON.stringify(data),
});
};

export const loginUser = (
data: LoginData,
): Promise<AuthResponse> => {
return apiRequest<AuthResponse>("/auth/login", {
method: "POST",
body: JSON.stringify(data),
});
};

export const getCurrentUser = (
token: string,
): Promise<{
success: boolean;
user: AuthUser;
}> => {
return apiRequest("/auth/me", {
method: "GET",
token,
});
};
