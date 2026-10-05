import { supabase, isSupabaseConfigured } from "../../../shared/lib/supabase.js";
import { opportunities as demoOpportunities, months as demoMonths } from "../../../shared/data/demo.js";
import { toOpportunityDTO } from "../../../shared/types/dto.js";
import { authService } from "../../auth/services/authService.js";

// In-memory/localStorage session cache for opportunities workflow states
const LOCAL_OPPORTUNITY_STATE_KEY = "jadwa_opportunity_states_v1";

function getLocalStates() {
  try {
    const raw = localStorage.getItem(LOCAL_OPPORTUNITY_STATE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLocalState(periodKey, index, patch) {
  try {
    const states = getLocalStates();
    if (!states[periodKey]) states[periodKey] = {};
    states[periodKey][index] = { ...states[periodKey][index], ...patch };
    localStorage.setItem(LOCAL_OPPORTUNITY_STATE_KEY, JSON.stringify(states));
  } catch {}
}

export const opportunityService = {
  /**
   * Get all opportunities for a given period
   */
  async getOpportunities(monthCode = "sep", explicitIsGuest = null) {
    const periodKey = monthCode === "aug" ? "2026-08" : "2026-09";

    let isGuest = explicitIsGuest;
    if (isGuest === null) {
      const user = await authService.getCurrentUser();
      isGuest = Boolean(user && user.isGuest);
    }

    if (!isGuest && isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("opportunities")
          .select("*")
          .eq("period_key", periodKey)
          .order("opportunity_index", { ascending: true });

        if (!error && data) {
          return data.map(toOpportunityDTO);
        }
        return [];
      } catch (err) {
        console.warn("[Opportunity Service] Error querying Supabase:", err);
        return [];
      }
    }

    // Default to domain template opportunities for explicit guest/demo user
    if (isGuest) {
      const localStates = getLocalStates()[periodKey] || {};
      const m = demoMonths[monthCode] || demoMonths.sep;
      return demoOpportunities.map((o, idx) => {
        const persisted = localStates[idx] || {};
        return {
          id: "demo-op-" + idx,
          index: idx,
          category: o.category,
          title: o.title,
          text: o.text,
          icon: o.icon,
          accent: o.accent,
          tint: o.tint,
          potentialSaving: m.amounts[idx],
          evidence: o.evidence,
          steps: o.steps,
          calculation: o.calculation,
          source: o.source,
          status: persisted.status || "new",
          dismissReason: persisted.reason || "",
          measurement: persisted.measurement || null,
        };
      });
    }

    return [];
  },

  /**
   * Update opportunity workflow state, dismissal reason, or measurement
   */
  async updateOpportunity(monthCode, index, { status, reason, measurement }, explicitIsGuest = null) {
    const periodKey = monthCode === "aug" ? "2026-08" : "2026-09";

    let isGuest = explicitIsGuest;
    if (isGuest === null) {
      const user = await authService.getCurrentUser();
      isGuest = Boolean(user && user.isGuest);
    }

    if (isGuest) {
      saveLocalState(periodKey, index, { status, reason, measurement });
    }

    if (!isGuest && isSupabaseConfigured && supabase) {
      try {
        const patch = { status, updated_at: new Date().toISOString() };
        if (reason !== undefined) patch.dismiss_reason = reason;
        if (measurement !== undefined) patch.measurement = measurement;

        await supabase
          .from("opportunities")
          .update(patch)
          .match({ period_key: periodKey, opportunity_index: index });
      } catch (err) {
        console.warn("[Opportunity Service] Error updating remote opportunity:", err);
      }
    }

    return { success: true };
  },
};
