import { z } from "zod";

export const csvFileMetaSchema = z.object({
  name: z.string().regex(/\.csv$/i, "الصيغة غير مدعومة. صدّر الملف بصيغة CSV UTF-8 ثم أعد اختياره."),
  size: z.number().max(5 * 1024 * 1024, "حجم الملف يتجاوز ٥ ميجابايت. قسّمه إلى ملف أصغر."),
});

export const mappingSchema = z.record(z.string(), z.number());
