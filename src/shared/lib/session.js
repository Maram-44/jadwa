/* Temporary, tab-local file preparation shared by Data Hub and the meeting. */
export const JadwaSession = (() => {
  const key = "jadwa-prepared-files-v1";
  function files() {
    try {
      const value = JSON.parse(sessionStorage.getItem(key) || "[]");
      if (!Array.isArray(value)) return [];
      return value.filter(
        (f) =>
          f &&
          typeof f.id === "string" &&
          typeof f.name === "string" &&
          ["sales", "costs", "inventory", "expenses"].includes(f.type) &&
          f.parsed &&
          Array.isArray(f.parsed.headers) &&
          Array.isArray(f.parsed.rows) &&
          f.mapping &&
          f.result &&
          /^\d{4}-(0[1-9]|1[0-2])$/.test(f.result.period) &&
          Array.isArray(f.result.valid) &&
          Array.isArray(f.result.invalid) &&
          Array.isArray(f.result.issues),
      );
    } catch {
      return [];
    }
  }
  function save(items) {
    const json = JSON.stringify(items);
    if (json.length > 2000000)
      throw new Error(
        "حجم البيانات المجهزة أكبر من مساحة الجلسة. جرّب ملفًا أصغر أو فترة أقصر.",
      );
    try {
      sessionStorage.setItem(key, json);
    } catch {
      throw new Error(
        "تعذر الاحتفاظ بالملفات في هذا التبويب. اسمح بتخزين بيانات الموقع أو جرّب ملفًا أصغر، ثم أعد التأكيد.",
      );
    }
  }
  const forPeriod = (period) =>
    files().filter((f) => f.result.period === period);
  const periodFor = (month) => (month === "aug" ? "2026-08" : "2026-09");
  return { files, save, forPeriod, periodFor };
})();
