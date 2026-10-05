import { supabase, isSupabaseConfigured } from "../../../shared/lib/supabase.js";
import { months as demoMonths } from "../../../shared/data/demo.js";
import { toPeriodDTO } from "../../../shared/types/dto.js";

export const dashboardService = {
  /**
   * Get executive business metrics for a given month code ('sep' or 'aug')
   */
  async getPeriodMetrics(monthCode = "sep") {
    const periodKey = monthCode === "aug" ? "2026-08" : "2026-09";

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("business_periods")
          .select("*")
          .eq("period_key", periodKey)
          .maybeSingle();

        if (!error && data) {
          return toPeriodDTO(data);
        }
      } catch (err) {
        console.warn("[Dashboard Service] Error fetching period from Supabase:", err);
      }
    }

    // Default to business domain demo figures
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
  },
};
