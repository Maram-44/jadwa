// DTOs and Data Converters for Jadwa (جدوى)
// Ensures frontend components receive predictable, domain-specific structures.

/**
 * Computes the avatar initial from a full name or email
 */
export function computeAvatarInitial(fullName, email) {
  if (fullName && typeof fullName === "string" && fullName.trim().length > 0) {
    return fullName.trim().charAt(0);
  }
  if (email && typeof email === "string" && email.trim().length > 0) {
    return email.trim().charAt(0).toUpperCase();
  }
  return "م";
}

/**
 * Transforms a Supabase profile row into a user profile DTO
 */
export function toProfileDTO(row) {
  if (!row) return null;
  const fullName = row.full_name || "";
  const email = row.email || "";
  const avatarInitial =
    row.avatar_initial && row.avatar_initial !== "ش"
      ? row.avatar_initial
      : computeAvatarInitial(fullName, email);

  return {
    id: row.id,
    email,
    fullName: fullName || "مستخدم جديد",
    businessName: row.business_name || "منشأتي",
    businessType: row.business_type || "مقهى ومطعم",
    role: row.role || "مالكة المنشأة",
    avatarInitial,
  };
}

/**
 * Transforms a business period row into a dashboard period DTO
 */
export function toPeriodDTO(row) {
  if (!row) return null;
  return {
    periodKey: row.period_key,
    monthCode: row.month_code,
    name: row.name,
    year: row.year,
    revenue: Number(row.revenue) || 0,
    cost: Number(row.cost) || 0,
    profit: Number(row.profit) || 0,
    saving: Number(row.potential_saving) || 0,
    sales: Array.isArray(row.weekly_sales) ? row.weekly_sales : [],
    costs: Array.isArray(row.weekly_costs) ? row.weekly_costs : [],
    changes: Array.isArray(row.changes) ? row.changes : ["+١٥٪", "+٨٪", "+٤٢٪"],
  };
}

/**
 * Transforms an opportunity row into a frontend opportunity DTO
 */
export function toOpportunityDTO(row) {
  if (!row) return null;
  return {
    id: row.id,
    index: row.opportunity_index ?? 0,
    category: row.category,
    title: row.title,
    text: row.description,
    icon: row.icon || "spark",
    accent: row.accent_color || "#0d9977",
    tint: row.tint_color || "#ebf9f3",
    potentialSaving: Number(row.potential_saving) || 0,
    evidence: row.evidence,
    steps: Array.isArray(row.steps) ? row.steps : [],
    calculation: row.calculation,
    source: row.source,
    status: row.status || "new",
    dismissReason: row.dismiss_reason || "",
    measurement: row.measurement || null,
  };
}

/**
 * Transforms product row + metrics row into a catalog product DTO
 */
export function toProductDTO(productRow, metricsRow) {
  return {
    id: productRow.code.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    dbId: productRow.id,
    name: productRow.name,
    code: productRow.code,
    group: productRow.group_name || "وجبات",
    parts: productRow.parts || null,
    stocks: productRow.stock_refs || [],
    opportunities: productRow.opportunity_refs || [],
    qty: metricsRow ? Number(metricsRow.qty) : 0,
    sales: metricsRow ? Number(metricsRow.sales) : 0,
    cost: metricsRow ? Number(metricsRow.cost) : 0,
  };
}

/**
 * Transforms inventory item row + metrics row into an inventory item DTO
 */
export function toInventoryDTO(itemRow, metricsRow) {
  return {
    id: itemRow.code.toLowerCase().replace(/[^a-z0-9]/g, "-"),
    dbId: itemRow.id,
    name: itemRow.name,
    code: itemRow.code,
    unit: itemRow.unit || "كجم",
    lead: itemRow.lead_time_days || 3,
    target: itemRow.target_stock_days || 10,
    opportunities: itemRow.opportunity_refs || [],
    cost: metricsRow ? Number(metricsRow.unit_cost) : 0,
    previousCost: metricsRow ? Number(metricsRow.previous_cost) : 0,
    opening: metricsRow ? Number(metricsRow.opening) : 0,
    incoming: metricsRow ? Number(metricsRow.incoming) : 0,
    used: metricsRow ? Number(metricsRow.used) : 0,
    waste: metricsRow ? Number(metricsRow.waste) : 0,
    adjustment: metricsRow ? Number(metricsRow.adjustment) : 0,
  };
}

/**
 * Transforms an expense row into a frontend expense DTO
 */
export function toExpenseDTO(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    vendor: row.vendor,
    amount: Number(row.amount) || 0,
    recurring: Boolean(row.recurring),
    day: row.day_of_month || 1,
    date: row.expense_date,
    renewDay: row.renew_day || null,
    opportunity: row.opportunity_ref ?? null,
    description: row.description || "",
  };
}

/**
 * Transforms a data hub file row into a session-compatible file DTO
 */
export function toDataHubFileDTO(row) {
  return {
    id: String(row.id),
    type: row.file_type,
    name: row.file_name,
    size: row.file_size || 0,
    origin: row.origin || "upload",
    preparedAt: row.prepared_at ? new Date(row.prepared_at).getTime() : Date.now(),
    parsed: {
      headers: row.headers || [],
      rows: Array.isArray(row.valid_rows) ? row.valid_rows : [],
    },
    mapping: row.mapping || {},
    result: {
      period: row.period_key,
      valid: Array.isArray(row.valid_rows) ? row.valid_rows : [],
      invalid: Array.isArray(row.invalid_rows) ? row.invalid_rows : [],
      issues: Array.isArray(row.issues) ? row.issues : [],
    },
  };
}
