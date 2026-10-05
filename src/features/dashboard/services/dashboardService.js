import { supabase, isSupabaseConfigured } from "../../../shared/lib/supabase.js";
import { months as demoMonths } from "../../../shared/data/demo.js";
import { toPeriodDTO } from "../../../shared/types/dto.js";
import { authService } from "../../auth/services/authService.js";

export const dashboardService = {
  /**
   * Get executive business metrics for a given month code ('sep' or 'aug')
   */
  async getPeriodMetrics(monthCode = "sep", explicitIsGuest = null) {
    const periodKey = monthCode === "aug" ? "2026-08" : "2026-09";
    const periodName = monthCode === "aug" ? "أغسطس" : "سبتمبر";

    let isGuest = explicitIsGuest;
    if (isGuest === null) {
      const user = await authService.getCurrentUser();
      isGuest = Boolean(user && user.isGuest);
    }

    if (!isGuest && isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("business_periods")
          .select("*")
          .eq("period_key", periodKey)
          .maybeSingle();

        if (!error && data) {
          return toPeriodDTO(data);
        }

        // Authenticated user with no period metrics yet in database:
        // Return blank/zero metrics so demo data does NOT overwrite real user state!
        return {
          periodKey,
          monthCode,
          name: periodName,
          year: 2026,
          revenue: 0,
          cost: 0,
          profit: 0,
          saving: 0,
          sales: [0, 0, 0, 0],
          costs: [0, 0, 0, 0],
          changes: ["٠٪", "٠٪", "٠٪"],
          amounts: [0, 0, 0],
          isEmpty: true,
        };
      } catch (err) {
        console.warn("[Dashboard Service] Error fetching period from Supabase:", err);
      }
    }

    // Only for explicit guest/demo mode
    if (isGuest) {
      const fallback = demoMonths[monthCode] || demoMonths.sep;
      return {
        periodKey,
        monthCode,
        name: fallback.name,
        year: 2026,
        revenue: fallback.revenue,
        cost: fallback.cost,
        profit: fallback.profit,
        saving: fallback.saving,
        sales: fallback.sales,
        costs: fallback.costs,
        changes: fallback.changes,
        amounts: fallback.amounts,
      };
    }

    return {
      periodKey,
      monthCode,
      name: periodName,
      year: 2026,
      revenue: 0,
      cost: 0,
      profit: 0,
      saving: 0,
      sales: [0, 0, 0, 0],
      costs: [0, 0, 0, 0],
      changes: ["٠٪", "٠٪", "٠٪"],
      amounts: [0, 0, 0],
      isEmpty: true,
    };
  },
};
