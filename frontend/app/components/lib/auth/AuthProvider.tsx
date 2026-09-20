"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
  type AuthUser,
  type LoginData,
  type RegisterData,
} from "@/app/components/lib/api/auth";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<AuthUser>;
  register: (data: RegisterData) => Promise<AuthUser>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = "cityhop_token";

const getStoredToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({
  children,
}: AuthProviderProps): React.ReactElement => {
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = useCallback(async (): Promise<void> => {
    const storedToken = getStoredToken();

    if (!storedToken) {
      setToken(null);
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await getCurrentUser(storedToken);

      setToken(storedToken);
      setUser(response.user);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const initializeAuth = async (): Promise<void> => {
      const storedToken = getStoredToken();

      if (!storedToken) {
        if (!cancelled) {
          setIsLoading(false);
        }

        return;
      }

      try {
        const response = await getCurrentUser(storedToken);

        if (!cancelled) {
          setToken(storedToken);
          setUser(response.user);
        }
      } catch {
        localStorage.removeItem(TOKEN_KEY);

        if (!cancelled) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void initializeAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (data: LoginData): Promise<AuthUser> => {
    const response = await loginUser(data);

    if (!response.token) {
      throw new Error(
        "Login succeeded but no authentication token was returned",
      );
    }

    localStorage.setItem(TOKEN_KEY, response.token);

    setToken(response.token);
    setUser(response.user);
    setIsLoading(false);

    return response.user;
  }, []);

  const register = useCallback(
    async (data: RegisterData): Promise<AuthUser> => {
      const response = await registerUser(data);

      if (response.token) {
        localStorage.setItem(TOKEN_KEY, response.token);

        setToken(response.token);
        setUser(response.user);
        setIsLoading(false);

        return response.user;
      }

      const loginResponse = await loginUser({
        email: data.email,
        password: data.password,
      });

      if (!loginResponse.token) {
        throw new Error(
          "Registration succeeded but authentication could not be completed",
        );
      }

      localStorage.setItem(TOKEN_KEY, loginResponse.token);

      setToken(loginResponse.token);
      setUser(loginResponse.user);
      setIsLoading(false);

      return loginResponse.user;
    },
    [],
  );

  const logout = useCallback((): void => {
    localStorage.removeItem(TOKEN_KEY);

    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, token, isLoading, login, register, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
