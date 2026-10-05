import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../../features/auth/services/authService.js";
import { supabase, isSupabaseConfigured } from "./supabase.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const current = await authService.getCurrentUser();
        if (mounted) {
          setUser(current);
        }
      } catch (err) {
        console.warn("[Auth Context] Error initializing auth:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    // Listen to Supabase auth state changes if active
    let authSubscription = null;
    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        if (session?.user) {
          const profile = await authService.getProfile(session.user.id, session.user);
          setUser({
            id: session.user.id,
            email: session.user.email,
            profile,
            isGuest: session.user.email === "demo@jadwa.app",
          });
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      });
      authSubscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (authSubscription) authSubscription.unsubscribe();
    };
  }, []);

  const login = async (credentials) => {
    const res = await authService.signIn(credentials);
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const register = async (data) => {
    const res = await authService.signUp(data);
    return res;
  };

  const loginAsGuest = async () => {
    const res = await authService.signInAsGuest();
    if (res.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
    location.href = "login.html";
  };

  const resetPassword = async (email) => {
    return authService.resetPassword(email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        loginAsGuest,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Graceful fallback for components used outside AuthProvider
    return {
      user: null,
      loading: false,
      isAuthenticated: false,
      login: async () => ({ user: null }),
      register: async () => ({ user: null }),
      loginAsGuest: async () => ({ user: null }),
      logout: async () => { location.href = "login.html"; },
      resetPassword: async () => ({ success: true }),
    };
  }
  return context;
}
