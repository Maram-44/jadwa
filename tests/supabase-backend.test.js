import test from "node:test";
import assert from "node:assert/strict";
import { loginSchema, registerSchema } from "../src/features/auth/schemas/authSchemas.js";
import { measurementSchema, dismissSchema } from "../src/features/opportunities/schemas/opportunitySchemas.js";
import { expenseSchema } from "../src/features/expenses/schemas/expenseSchemas.js";
import { csvFileMetaSchema } from "../src/features/data-hub/schemas/dataHubSchemas.js";
import {
  computeAvatarInitial,
  formatChange,
  toProfileDTO,
  toPeriodDTO,
  toOpportunityDTO,
  toProductDTO,
  toInventoryDTO,
  toExpenseDTO,
  toDataHubFileDTO,
} from "../src/shared/types/dto.js";

test("Zod validation: Login Schema", () => {
  const valid = loginSchema.safeParse({
    email: "owner@jadwa.app",
    password: "Password123!",
  });
  assert.equal(valid.success, true);

  const invalidEmail = loginSchema.safeParse({
    email: "not-an-email",
    password: "Password123!",
  });
  assert.equal(invalidEmail.success, false);
  const issues = invalidEmail.error.issues || invalidEmail.error.errors || [];
  const emailIssue = issues.find((e) => e.path[0] === "email");
  assert.ok(emailIssue);
  assert.equal(typeof emailIssue.message, "string");

  const shortPassword = loginSchema.safeParse({
    email: "owner@jadwa.app",
    password: "123",
  });
  assert.equal(shortPassword.success, false);
});

test("Zod validation: Register Schema matching passwords", () => {
  const matching = registerSchema.safeParse({
    "full-name": "الشيماء النعيمي",
    email: "owner@jadwa.app",
    password: "SecurePassword123",
    "confirm-password": "SecurePassword123",
  });
  assert.equal(matching.success, true);

  const mismatch = registerSchema.safeParse({
    "full-name": "الشيماء النعيمي",
    email: "owner@jadwa.app",
    password: "SecurePassword123",
    "confirm-password": "DifferentPassword456",
  });
  assert.equal(mismatch.success, false);
});

test("Zod validation: Opportunity Measurement Schema", () => {
  const validMeasure = measurementSchema.safeParse({
    before: 1600,
    after: 400,
    basis: "مقارنة استهلاك الخضار بين سبتمبر وأغسطس",
    source: "سجل الهدر الشهري",
  });
  assert.equal(validMeasure.success, true);

  const negativeMeasure = measurementSchema.safeParse({
    before: -100,
    after: 400,
    basis: "فترة غير صالحة",
    source: "مرجع",
  });
  assert.equal(negativeMeasure.success, false);
});

test("Zod validation: Expense Schema", () => {
  const validExp = expenseSchema.safeParse({
    name: "إيجار الفرع الرئيسي",
    category: "rent",
    vendor: "الشركة العقارية",
    amount: 3500,
    day: 1,
    recurring: true,
  });
  assert.equal(validExp.success, true);

  const badCategory = expenseSchema.safeParse({
    name: "مجهول",
    category: "invalid_category",
    vendor: "جهة",
    amount: 500,
    day: 1,
  });
  assert.equal(badCategory.success, false);
});

test("Zod validation: CSV metadata check", () => {
  assert.equal(csvFileMetaSchema.safeParse({ name: "sales.csv", size: 1024 }).success, true);
  assert.equal(csvFileMetaSchema.safeParse({ name: "sales.xlsx", size: 1024 }).success, false);
  assert.equal(csvFileMetaSchema.safeParse({ name: "sales.csv", size: 10 * 1024 * 1024 }).success, false);
});

test("DTO converters format database rows properly", () => {
  const profile = toProfileDTO({
    id: "uuid-1",
    email: "demo@jadwa.app",
    full_name: "الشيماء",
    business_name: "مقهى ومطعم الأفق",
    role: "مالكة المنشأة",
  });
  assert.equal(profile.fullName, "الشيماء");
  assert.equal(profile.businessName, "مقهى ومطعم الأفق");
  assert.equal(profile.avatarInitial, "ا");

  const period = toPeriodDTO({
    period_key: "2026-09",
    month_code: "sep",
    name: "سبتمبر",
    year: 2026,
    revenue: "48000.00",
    cost: "36000.00",
    profit: "12000.00",
    potential_saving: "2500.00",
    weekly_sales: [9000, 12000, 15000, 12000],
    weekly_costs: [7500, 8500, 10500, 9500],
    changes: ["+١٥٪", "+٨٪", "+٤٢٪"],
  });
  assert.equal(period.revenue, 48000);
  assert.equal(period.profit, 12000);
  assert.equal(period.sales.length, 4);

  const opportunity = toOpportunityDTO({
    id: "op-1",
    opportunity_index: 0,
    category: "هدر المخزون",
    title: "قلّل هدر المكونات",
    description: "تكرر الهدر",
    potential_saving: "1200.00",
    evidence: "أدلة",
    steps: ["خطوة 1"],
    calculation: "حساب",
    source: "مصدر",
    status: "active",
  });
  assert.equal(opportunity.potentialSaving, 1200);
  assert.equal(opportunity.status, "active");

  const product = toProductDTO(
    { id: "p1", code: "PR-001", name: "برجر دجاج", group_name: "وجبات" },
    { qty: 400, sales: "12000.00", cost: "8000.00" },
  );
  assert.equal(product.code, "PR-001");
  assert.equal(product.sales, 12000);
  assert.equal(product.cost, 8000);

  const expense = toExpenseDTO({
    id: "exp-1",
    name: "اشتراك برمجيات",
    category: "software",
    vendor: "مقدم أ",
    amount: "500.00",
    day_of_month: 12,
    expense_date: "2026-09-12",
    recurring: true,
  });
  assert.equal(expense.amount, 500);
  assert.equal(expense.recurring, true);
});

test("Dynamic avatar initial computes correctly from full name or email fallback", () => {
  assert.equal(computeAvatarInitial("محمد العتيبي", "m@example.com"), "م");
  assert.equal(computeAvatarInitial("Maram Saleh", "maram@example.com"), "M");
  assert.equal(computeAvatarInitial("الشيماء", "demo@jadwa.app"), "ا");
  assert.equal(computeAvatarInitial("", "maram@example.com"), "M");
  assert.equal(computeAvatarInitial(null, "s22170211221@hu.edu.ye"), "S");
  assert.equal(computeAvatarInitial("  خالد عبد الله  ", ""), "خ");
});

test("Period DTO properly converts object changes with {label, percent, direction}", () => {
  assert.equal(formatChange({ label: "+١٥٪", percent: 15, direction: "up" }), "+١٥٪");
  assert.equal(formatChange({ percent: 8, direction: "down" }), "-8٪");
  assert.equal(formatChange("+٤٢٪"), "+٤٢٪");

  const periodWithObjChanges = toPeriodDTO({
    period_key: "2026-09",
    month_code: "sep",
    name: "سبتمبر",
    revenue: 48000,
    cost: 36000,
    profit: 12000,
    changes: [
      { label: "+١٥٪", percent: 15, direction: "up" },
      { label: "+٨٪", percent: 8, direction: "up" },
      { label: "+٤٢٪", percent: 42, direction: "up" },
    ],
  });

  assert.deepEqual(periodWithObjChanges.changes, ["+١٥٪", "+٨٪", "+٤٢٪"]);
  assert.equal(typeof periodWithObjChanges.changes[0], "string");
});

test("Real Supabase authentication flow: guest login, normal login, profile loading, session persistence, and logout", async () => {
  if (!globalThis.localStorage) {
    const store = new Map();
    globalThis.localStorage = {
      getItem: (k) => store.get(k) || null,
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
      clear: () => store.clear(),
    };
  }
  if (!globalThis.sessionStorage) {
    const store = new Map();
    globalThis.sessionStorage = {
      getItem: (k) => store.get(k) || null,
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
      clear: () => store.clear(),
    };
  }

  const { authService } = await import("../src/features/auth/services/authService.js");
  const { DEMO_CREDENTIALS } = await import("../src/shared/lib/supabase.js");

  // 1. Guest login performs a real Supabase signInWithPassword using demo credentials
  const guestRes = await authService.signInAsGuest();
  assert.equal(guestRes.error, null);
  assert.ok(guestRes.user, "Guest login should return an authenticated user");
  assert.equal(guestRes.user.email, DEMO_CREDENTIALS.email);
  assert.notEqual(guestRes.user.id, "guest-judge-session", "Should not use fake hardcoded guest user ID");
  assert.equal(guestRes.user.isGuest, false, "Authenticated Supabase user is not a fake guest");
  assert.ok(guestRes.user.profile, "User profile should be loaded from Supabase");
  assert.equal(guestRes.user.profile.fullName, "الشيماء", "Profile full name should be loaded from profiles table");
  assert.equal(guestRes.user.profile.role, "مالكة المنشأة");

  // 2. Simulating page refresh: getCurrentUser preserves authenticated session
  const currentUser = await authService.getCurrentUser();
  assert.ok(currentUser, "Session must be preserved after refresh");
  assert.equal(currentUser.id, guestRes.user.id);
  assert.equal(currentUser.email, DEMO_CREDENTIALS.email);
  assert.equal(currentUser.profile.fullName, "الشيماء");

  // 3. Normal login with credentials also works
  const loginRes = await authService.signIn({
    email: DEMO_CREDENTIALS.email,
    password: DEMO_CREDENTIALS.password,
  });
  assert.equal(loginRes.error, null);
  assert.ok(loginRes.user);
  assert.equal(loginRes.user.id, guestRes.user.id);

  // 4. Logout works and cleans the session
  await authService.signOut();
  const afterSignOut = await authService.getCurrentUser();
  assert.equal(afterSignOut, null, "User should be null after signing out");
});


