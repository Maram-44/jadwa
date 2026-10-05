import { supabase, isSupabaseConfigured } from "../../../shared/lib/supabase.js";
import {
  catalogProducts as fallbackProducts,
  catalogStock as fallbackStock,
  productMetrics,
  stockMetrics,
  normalizeSearch,
  marginTarget,
} from "../../../shared/data/catalog.js";
import { toProductDTO, toInventoryDTO } from "../../../shared/types/dto.js";

export const catalogService = {
  /**
   * Fetch products for the given month
   */
  async getProducts(monthCode = "sep") {
    const periodKey = monthCode === "aug" ? "2026-08" : "2026-09";

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: productsData, error: prodErr } = await supabase
          .from("products")
          .select("*");

        const { data: metricsData, error: metErr } = await supabase
          .from("product_period_metrics")
          .select("*")
          .eq("period_key", periodKey);

        if (!prodErr && !metErr && productsData && productsData.length > 0) {
          const metricsMap = new Map((metricsData || []).map((m) => [m.product_id, m]));
          return productsData.map((p) => {
            const m = metricsMap.get(p.id);
            const dto = toProductDTO(p, m);
            return {
              ...dto,
              [monthCode]: { qty: dto.qty, sales: dto.sales, cost: dto.cost },
            };
          });
        }
      } catch (err) {
        console.warn("[Catalog Service] Error fetching products from Supabase:", err);
      }
    }

    return fallbackProducts;
  },

  /**
   * Fetch inventory items for the given month
   */
  async getInventory(monthCode = "sep") {
    const periodKey = monthCode === "aug" ? "2026-08" : "2026-09";

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: itemsData, error: itemErr } = await supabase
          .from("inventory_items")
          .select("*");

        const { data: metricsData, error: metErr } = await supabase
          .from("inventory_period_metrics")
          .select("*")
          .eq("period_key", periodKey);

        if (!itemErr && !metErr && itemsData && itemsData.length > 0) {
          const metricsMap = new Map((metricsData || []).map((m) => [m.item_id, m]));
          return itemsData.map((i) => {
            const m = metricsMap.get(i.id);
            return toInventoryDTO(i, m);
          });
        }
      } catch (err) {
        console.warn("[Catalog Service] Error fetching inventory from Supabase:", err);
      }
    }

    return fallbackStock;
  },

  /**
   * Get filtered and sorted rows for the catalog table
   */
  async getCatalogRows(
    tab,
    period,
    {
      query = "",
      status = "all",
      related = null,
      sortKey = null,
      direction = "asc",
    } = {},
  ) {
    const source = tab === "products" ? await this.getProducts(period) : await this.getInventory(period);
    const metricsFn = tab === "products" ? productMetrics : stockMetrics;

    const priority =
      tab === "products"
        ? { loss: 0, low: 1, missing: 2, normal: 3 }
        : { low: 0, waste: 1, excess: 2, slow: 3, normal: 4 };

    return source
      .map((p) => ({ ...p, ...metricsFn(p, period) }))
      .filter(
        (p) =>
          (!query ||
            normalizeSearch(p.name + " " + p.code).includes(
              normalizeSearch(query),
            )) &&
          (status === "all" || p.status === status) &&
          (related === null || p.opportunities.includes(related)),
      )
      .sort((a, b) => {
        if (!sortKey)
          return (
            priority[a.status] - priority[b.status] ||
            a.name.localeCompare(b.name, "ar")
          );
        if (a[sortKey] === null) return b[sortKey] === null ? 0 : 1;
        if (b[sortKey] === null) return -1;
        return (a[sortKey] - b[sortKey]) * (direction === "asc" ? 1 : -1);
      });
  },
};
