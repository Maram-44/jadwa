import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "البريد الإلكتروني مطلوب.")
    .email("أدخل بريدًا إلكترونيًا صحيحًا، مثل name@example.com.")
    .max(254, "البريد الإلكتروني طويل جدًا."),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة.")
    .min(8, "استخدم ٨ أحرف على الأقل.")
    .max(128, "كلمة المرور طويلة جدًا."),
});

export const registerSchema = z
  .object({
    "full-name": z
      .string()
      .trim()
      .min(1, "الاسم الكامل مطلوب.")
      .min(2, "أدخل اسمًا من حرفين على الأقل.")
      .max(100, "الاسم طويل جدًا."),
    email: z
      .string()
      .trim()
      .min(1, "البريد الإلكتروني مطلوب.")
      .email("أدخل بريدًا إلكترونيًا صحيحًا، مثل name@example.com.")
      .max(254, "البريد الإلكتروني طويل جدًا."),
    password: z
      .string()
      .min(1, "كلمة المرور مطلوبة.")
      .min(8, "استخدم ٨ أحرف على الأقل في هذه المعاينة.")
      .max(128, "كلمة المرور طويلة جدًا."),
    "confirm-password": z
      .string()
      .min(1, "تأكيد كلمة المرور مطلوب."),
  })
  .refine((data) => data.password === data["confirm-password"], {
    message: "كلمتا المرور غير متطابقتين.",
    path: ["confirm-password"],
  });

export const passwordResetSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "البريد الإلكتروني مطلوب.")
    .email("أدخل بريدًا إلكترونيًا صحيحًا."),
});
