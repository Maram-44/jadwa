import { supabase, isSupabaseConfigured, DEMO_CREDENTIALS } from "../../../shared/lib/supabase.js";
import { toProfileDTO, computeAvatarInitial } from "../../../shared/types/dto.js";
import { JadwaSession } from "../../../shared/lib/session.js";

const LOCAL_SESSION_KEY = "jadwa_auth_user";

export const authService = {
  /**
   * Get the current active user from Supabase or local guest storage
   */
  async getCurrentUser() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (user && !error) {
          // A real authenticated user exists: clean any leftover guest session
          try {
            localStorage.removeItem(LOCAL_SESSION_KEY);
          } catch {}

          const profile = await this.getProfile(user.id, user);
          return {
            id: user.id,
            email: user.email,
            profile,
            isGuest: false,
          };
        }
      } catch (e) {
        console.warn("[Jadwa Auth] Error fetching Supabase user, checking local session:", e);
      }
    }

    // Only allow guest session if explicitly created via "الدخول كزائر"
    try {
      const stored = localStorage.getItem(LOCAL_SESSION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.isGuest) {
          return parsed;
        }
      }
    } catch {
      // ignore JSON parse error
    }

    return null;
  },

  /**
   * Get user profile by user UUID, falling back to authenticated user metadata
   */
  async getProfile(userId, fallbackUser = null) {
    let authUser = fallbackUser;
    if (!authUser && isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.auth.getUser();
        authUser = data?.user || null;
      } catch {}
    }

    const isDemoEmail = authUser?.email === DEMO_CREDENTIALS.email;
    const meta = authUser?.user_metadata || {};
    const metaFullName = meta.full_name?.trim() || "";
    const emailFallbackName = authUser?.email ? authUser.email.split("@")[0] : "";
    const resolvedFallbackName = metaFullName || emailFallbackName || (isDemoEmail ? "الشيماء" : "مستخدم");
    const fallbackInitial = computeAvatarInitial(resolvedFallbackName, authUser?.email);

    if (!isSupabaseConfigured || !supabase) {
      return {
        id: userId,
        email: authUser?.email || "",
        fullName: resolvedFallbackName,
        businessName: meta.business_name || "منشأتي",
        businessType: "مقهى ومطعم",
        role: "مالكة المنشأة",
        avatarInitial: fallbackInitial,
      };
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!error && data) {
        const dto = toProfileDTO(data);
        // If profile was populated with default 'الشيماء' but this is a real user
        if (!isDemoEmail) {
          if (metaFullName) {
            dto.fullName = metaFullName;
          } else if (dto.fullName === "الشيماء" || !dto.fullName) {
            dto.fullName = emailFallbackName || "مستخدم";
          }
        }
        if (data.avatar_initial) {
          dto.avatarInitial = data.avatar_initial;
        } else {
          dto.avatarInitial = computeAvatarInitial(dto.fullName, authUser?.email || dto.email);
        }
        return dto;
      }

      // If profiles row not created yet, create it from auth metadata
      const profileToCreate = {
        id: userId,
        email: authUser?.email || "",
        full_name: resolvedFallbackName,
        business_name: meta.business_name || "منشأتي",
        business_type: "مقهى ومطعم",
        role: "مالكة المنشأة",
        avatar_initial: fallbackInitial,
      };

      await supabase
        .from("profiles")
        .upsert(profileToCreate)
        .catch(() => {});

      return toProfileDTO(profileToCreate);
    } catch {
      return {
        id: userId,
        email: authUser?.email || "",
        fullName: resolvedFallbackName,
        businessName: meta.business_name || "منشأتي",
        businessType: "مقهى ومطعم",
        role: "مالكة المنشأة",
        avatarInitial: fallbackInitial,
      };
    }
  },

  /**
   * Register a new user
   */
  async signUp({ email, password, fullName }) {
    if (!isSupabaseConfigured || !supabase) {
      const avatarInitial = computeAvatarInitial(fullName, email);
      const mockUser = {
        id: "usr-" + Date.now(),
        email,
        profile: {
          id: "usr-" + Date.now(),
          fullName: fullName || email.split("@")[0] || "مستخدم جديد",
          businessName: "منشأتي",
          businessType: "مقهى ومطعم",
          role: "مالكة المنشأة",
          avatarInitial,
        },
        isGuest: false,
      };
      return { user: mockUser, error: null };
    }

    try {
      const avatarInitial = computeAvatarInitial(fullName, email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            business_name: "منشأتي",
            avatar_initial: avatarInitial,
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      const user = data.user;
      if (user) {
        await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            email: user.email,
            full_name: fullName,
            business_name: "منشأتي",
            business_type: "مقهى ومطعم",
            role: "مالكة المنشأة",
            avatar_initial: avatarInitial,
          })
          .catch(() => {});
      }

      // Explicitly sign out so user goes through normal login flow
      await supabase.auth.signOut().catch(() => {});
      try {
        localStorage.removeItem(LOCAL_SESSION_KEY);
      } catch {}

      return { user, error: null };
    } catch (err) {
      return { user: null, error: err.message || "حدث خطأ أثناء إنشاء الحساب." };
    }
  },

  /**
   * Sign in with email and password
   */
  async signIn({ email, password }) {
    // Clear any previous guest/demo session before real login
    try {
      localStorage.removeItem(LOCAL_SESSION_KEY);
      sessionStorage.clear();
      JadwaSession.clear();
    } catch {}

    if (!isSupabaseConfigured || !supabase) {
      const avatarInitial = computeAvatarInitial(email.split("@")[0], email);
      const mockUser = {
        id: "usr-" + Date.now(),
        email,
        profile: {
          id: "usr-" + Date.now(),
          fullName: email.split("@")[0] || "مستخدم جديد",
          businessName: "منشأتي",
          businessType: "مقهى ومطعم",
          role: "مالكة المنشأة",
          avatarInitial,
        },
        isGuest: false,
      };
      return { user: mockUser, error: null };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      const profile = await this.getProfile(data.user.id, data.user);
      return {
        user: {
          id: data.user.id,
          email: data.user.email,
          profile,
          isGuest: false,
        },
        error: null,
      };
    } catch (err) {
      return { user: null, error: err.message || "تعذر تسجيل الدخول." };
    }
  },

  /**
   * Continue as Guest / Demo Account: performs a real Supabase signInWithPassword
   * using the demo credentials from .env
   */
  async signInAsGuest() {
    const creds = {
      email: DEMO_CREDENTIALS.email,
      password: DEMO_CREDENTIALS.password,
    };

    let res = await this.signIn(creds);

    // If login failed in Supabase due to unseeded user in fresh environment, attempt auto-signup & seed
    if (res.error && isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signUp({
          email: creds.email,
          password: creds.password,
          options: {
            data: {
              full_name: "الشيماء",
              business_name: "منشأتي",
              avatar_initial: "ش",
            },
          },
        });
        res = await this.signIn(creds);
        if (res.user?.id) {
          await supabase.rpc("seed_jadwa_user_data", { target_user_id: res.user.id }).catch(() => {});
        }
      } catch (err) {
        console.warn("[Jadwa Auth] Auto-provision fallback error:", err);
      }
    }

    return res;
  },

  /**
   * Password reset flow
   */
  async resetPassword(email) {
    if (!isSupabaseConfigured || !supabase) {
      return { success: true, message: "تم إرسال رابط استعادة كلمة المرور تجريبيًا." };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/login.html",
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, message: "تم إرسال رابط استعادة كلمة المرور إلى بريدك." };
    } catch (err) {
      return { success: false, message: err.message || "تعذر إرسال رابط الاستعادة." };
    }
  },

  /**
   * Sign out
   */
  async signOut() {
    try {
      localStorage.removeItem(LOCAL_SESSION_KEY);
      localStorage.removeItem("jadwa_opportunity_states_v1");
      sessionStorage.clear();
      JadwaSession.clear();
    } catch {}

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("[Jadwa Auth] Error signing out:", err);
      }
    }

    return { success: true };
  },
};
