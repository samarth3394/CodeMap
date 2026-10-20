import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, UserResponse, getToken, setToken, removeToken } from '../services/api';
import { useNotification } from './NotificationContext';

interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'signup' | 'forgot';
  openAuthModal: (mode?: 'login' | 'signup' | 'forgot') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<string | undefined>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(() => {
    const cached = localStorage.getItem('codemap_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [token, setTokenState] = useState<string | null>(getToken);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const { showNotification } = useNotification();

  // Validate session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const currentToken = getToken();
      if (!currentToken) {
        setIsLoading(false);
        return;
      }

      try {
        const profile = await api.auth.getMe();
        setUser(profile);
        localStorage.setItem('codemap_user', JSON.stringify(profile));
      } catch {
        // Token invalid or backend unreachable
        removeToken();
        setUser(null);
        setTokenState(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const openAuthModal = (mode: 'login' | 'signup' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.login({ email, password });
      setToken(res.access_token);
      setTokenState(res.access_token);
      setUser(res.user);
      localStorage.setItem('codemap_user', JSON.stringify(res.user));

      showNotification({
        title: 'Welcome back!',
        message: `Logged in as ${res.user.full_name}`,
        type: 'success',
      });
      closeAuthModal();
    } catch (err: any) {
      showNotification({
        title: 'Authentication Failed',
        message: err.detail || 'Could not verify credentials. Check email and password.',
        type: 'error',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      const res = await api.auth.signup({ email, password, full_name: fullName });
      setToken(res.access_token);
      setTokenState(res.access_token);
      setUser(res.user);
      localStorage.setItem('codemap_user', JSON.stringify(res.user));

      showNotification({
        title: 'Account Created',
        message: `Welcome to CodeMap, ${res.user.full_name}!`,
        type: 'success',
      });
      closeAuthModal();
    } catch (err: any) {
      showNotification({
        title: 'Registration Error',
        message: err.detail || 'Could not create account. Please try again.',
        type: 'error',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout().catch(() => {});
    } finally {
      removeToken();
      setUser(null);
      setTokenState(null);
      showNotification({
        title: 'Signed Out',
        message: 'You have been safely signed out.',
        type: 'info',
      });
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const res = await api.auth.forgotPassword(email);
      showNotification({
        title: 'Reset Link Sent',
        message: 'If the email exists, password reset instructions have been issued.',
        type: 'info',
      });
      return res.dev_reset_token;
    } catch (err: any) {
      showNotification({
        title: 'Reset Request Failed',
        message: err.detail || 'Could not process password reset request.',
        type: 'error',
      });
      throw err;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await api.auth.resetPassword({ token, new_password: newPassword });
      showNotification({
        title: 'Password Updated',
        message: 'Your password has been reset. Please log in with your new credentials.',
        type: 'success',
      });
      setAuthModalMode('login');
    } catch (err: any) {
      showNotification({
        title: 'Reset Failed',
        message: err.detail || 'Invalid or expired reset token.',
        type: 'error',
      });
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
