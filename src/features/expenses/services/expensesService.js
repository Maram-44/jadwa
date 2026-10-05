import { supabase, isSupabaseConfigured } from "../../../shared/lib/supabase.js";
import {
  expenseCategories,
  expenseRecords as fallbackRecords,
  expenseComparison,
} from "../../../shared/data/expenses.js";
import { normalizeSearch } from "../../../shared/data/catalog.js";
import { toExpenseDTO } from "../../../shared/types/dto.js";

export const expensesService = {
  /**
   * Get raw expense records for the period
   */
  async getExpenseRecords(period = "sep") {
    const periodKey = period === "aug" ? "2026-08" : "2026-09";

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("expenses")
          .select("*")
          .eq("period_key", periodKey);

        if (!error && data && data.length > 0) {
          return data.map(toExpenseDTO);
        }
      } catch (err) {
        console.warn("[Expenses Service] Error fetching expenses from Supabase:", err);
      }
    }

    return fallbackRecords.map((r) => ({
      id: r.id,
      name: r.name,
      category: r.category,
      vendor: r.vendor,
      recurring: r.recurring,
      day: r.day,
      amount: r[period] ?? 0,
      date: `2026-${period === "aug" ? "08" : "09"}-${String(r.day).padStart(2, "0")}`,
      opportunity: r.opportunity,
      renewDay: r.renewDay || null,
      description: r.description,
    }));
  },

  /**
   * Get filtered & sorted expense rows
   */
  async getExpenseRows(
    period,
    {
      query = "",
      category = "all",
      recurrence = "all",
      related = false,
      sort = "date-desc",
    } = {},
  ) {
    const records = await this.getExpenseRecords(period);
    const q = normalizeSearch(query);

    return records
      .map((r, i) => ({
        ...r,
        category: expenseCategories.some((c) => c.id === r.category)
          ? r.category
          : "unclassified",
        sourceRow: i + 2,
      }))
      .filter(
        (r) =>
          (!q || normalizeSearch(r.name + " " + r.vendor).includes(q)) &&
          (category === "all" || r.category === category) &&
          (recurrence === "all" ||
            r.recurring === (recurrence === "recurring")) &&
          (!related || r.opportunity === 2),
      )
      .sort((a, b) =>
        sort.startsWith("amount")
          ? (a.amount - b.amount) * (sort.endsWith("asc") ? 1 : -1)
          : a.date.localeCompare(b.date) * (sort.endsWith("asc") ? 1 : -1),
      );
  },

  /**
   * Get summary totals, recurring metrics, and category distributions
   */
  async getExpenseSummary(period) {
    const rows = await this.getExpenseRows(period);
    const previous = period === "sep" ? await this.getExpenseRows("aug") : null;
    const total = rows.reduce((s, r) => s + r.amount, 0);

    return {
      total,
      comparison: expenseComparison(
        total,
        previous ? previous.reduce((s, r) => s + r.amount, 0) : null,
      ),
      recurringTotal: rows
        .filter((r) => r.recurring)
        .reduce((s, r) => s + r.amount, 0),
      recurringCount: rows.filter((r) => r.recurring).length,
      categories: expenseCategories.map((c) => ({
        ...c,
        total: rows
          .filter((r) => r.category === c.id)
          .reduce((s, r) => s + r.amount, 0),
      })),
    };
  },

  /**
   * Add a new expense record
   */
  async createExpense(expenseData) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from("expenses")
          .insert([expenseData])
          .select()
          .single();

        if (!error && data) {
          return { data: toExpenseDTO(data), error: null };
        }
      } catch (err) {
        return { data: null, error: err.message };
      }
    }

    return { data: { ...expenseData, id: "local-" + Date.now() }, error: null };
  },
};
