import { z } from "zod";

export const measurementSchema = z.object({
  before: z
    .number({ invalid_type_error: "أدخلي تكلفة صحيحة قبل الإجراء." })
    .min(0, "التكلفة لا يمكن أن تكون سالبة.")
    .max(1000000000, "المبلغ كبير جدًا."),
  after: z
    .number({ invalid_type_error: "أدخلي تكلفة صحيحة بعد الإجراء." })
    .min(0, "التكلفة لا يمكن أن تكون سالبة.")
    .max(1000000000, "المبلغ كبير جدًا."),
  basis: z
    .string()
    .trim()
    .min(1, "أكملي أساس المقارنة وتوضيح المدة وحجم النشاط.")
    .max(500, "أساس المقارنة طويل جدًا."),
  source: z
    .string()
    .trim()
    .min(1, "أكملي مرجع القياس.")
    .max(250, "مرجع القياس طويل جدًا."),
});

export const dismissSchema = z.object({
  reason: z
    .string()
    .trim()
    .max(300, "السبب لا يجب أن يتجاوز ٣٠٠ محرف.")
    .optional(),
});
