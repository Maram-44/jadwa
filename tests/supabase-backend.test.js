import test from "node:test";
import assert from "node:assert/strict";
import { loginSchema, registerSchema } from "../src/features/auth/schemas/authSchemas.js";
import { measurementSchema, dismissSchema } from "../src/features/opportunities/schemas/opportunitySchemas.js";
import { expenseSchema } from "../src/features/expenses/schemas/expenseSchemas.js";
import { csvFileMetaSchema } from "../src/features/data-hub/schemas/dataHubSchemas.js";
import {
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
