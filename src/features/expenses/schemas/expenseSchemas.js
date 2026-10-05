import { z } from "zod";

export const expenseSchema = z.object({
  name: z.string().trim().min(1, "اسم البند مطلوب.").max(120, "الاسم طويل جدًا."),
  category: z.enum(["rent", "payroll", "utilities", "software", "marketing", "unclassified"], {
    errorMap: () => ({ message: "التصنيف المختار غير صالح." }),
  }),
  vendor: z.string().trim().min(1, "اسم الجهة مطلوب.").max(120, "اسم الجهة طويل جدًا."),
  amount: z.number().min(0, "المبلغ يجب أن يكون أكبر من أو يساوي صفر.").max(100000000, "المبلغ كبير جدًا."),
  day: z.number().int().min(1).max(31, "اليوم يجب أن يكون بين ١ و٣١."),
  recurring: z.boolean().default(true),
  renewDay: z.number().int().min(1).max(31).nullable().optional(),
  description: z.string().trim().max(500).optional(),
});
