/* CSV preparation only. No imported record is used by the demo analytics. */
export const HubData = (() => {
  const fields = {
    date: ["التاريخ", "date,transaction_date,التاريخ,تاريخ"],
    period: ["الفترة الشهرية", "period,month,الفترة,الشهر"],
    code: [
      "رمز المنتج أو المادة",
      "product_code,item_code,sku,رمز المنتج,رمز المادة,الكود",
    ],
    name: [
      "اسم المنتج أو البند",
      "name,product_name,item_name,description,اسم المنتج,اسم المادة,البند,الاسم",
    ],
    qty: ["الكمية المباعة", "qty,quantity,الكمية,الكمية المباعة"],
    sales: ["صافي المبيعات", "net_sales,sales,revenue,صافي المبيعات,المبيعات"],
    unitCost: ["تكلفة الوحدة", "unit_cost,تكلفة الوحدة"],
    totalCost: [
      "تكلفة الوحدات المباعة",
      "total_cost,cost_of_sales,تكلفة المبيعات,تكلفة الوحدات المباعة",
    ],
    unit: ["وحدة القياس", "unit,الوحدة,وحدة القياس"],
    opening: ["رصيد البداية", "opening,opening_balance,رصيد البداية"],
    incoming: ["الوارد", "incoming,received,الوارد"],
    used: ["المستهلك", "used,consumed,المستهلك"],
    waste: ["الهدر", "waste,الهدر"],
    adjustment: ["التسويات", "adjustment,التسويات"],
    amount: ["المبلغ", "amount,expense,المبلغ"],
    vendor: ["الجهة", "vendor,supplier,الجهة,المورد"],
    category: ["التصنيف", "category,التصنيف"],
    recurring: ["التكرار", "recurring,recurrence,التكرار"],
  };
  const schemas = {
    sales: {
      label: "المبيعات",
      icon: "chart",
      description: "تتبّع المبيعات واربط كل منتج بكمياته وإيراداته.",
      fields: ["date", "code", "name", "qty", "sales"],
      required: ["date", "code", "qty", "sales"],
      note: "الكمية وصافي المبيعات بعد الخصومات وغير شامل الضريبة. القالب للعمليات غير السالبة؛ المرتجعات السالبة تحتاج معالجة منفصلة.",
    },
    costs: {
      label: "تكلفة المنتجات",
      icon: "tag",
      description: "جهّز تكلفة الأصناف لحساب هامش الربح.",
      fields: ["period", "code", "unitCost", "totalCost"],
      required: ["period", "code"],
      note: "طابق تكلفة الوحدة أو تكلفة الوحدات المباعة فقط، وليس كليهما. الفترة بصيغة YYYY-MM؛ تكلفة الهدر والمصاريف العامة مستبعدة.",
    },
    inventory: {
      label: "المخزون والهدر",
      icon: "box",
      description: "افهم حركة المواد، وما بقي منها وما هُدر.",
      fields: [
        "date",
        "code",
        "name",
        "unit",
        "opening",
        "incoming",
        "used",
        "waste",
        "adjustment",
        "unitCost",
      ],
      required: [
        "date",
        "code",
        "unit",
        "opening",
        "incoming",
        "used",
        "waste",
        "unitCost",
      ],
      note: "التاريخ هو تاريخ لقطة المخزون. رصيد النهاية = البداية + الوارد − المستهلك − الهدر + التسويات. رموز المواد مستقلة عن رموز المنتجات.",
    },
    expenses: {
      label: "المصروفات",
      icon: "wallet",
      description: "راجع مصروفات التشغيل والالتزامات المتكررة.",
      fields: ["date", "name", "amount", "vendor", "category", "recurring"],
      required: ["date", "name", "amount"],
      note: "مصروفات التشغيل فقط، غير شاملة الضريبة. لا تُضف تكلفة المنتجات أو شراء المخزون أو الهدر مرة ثانية. التكرار: شهري / غير متكرر؛ اتركه فارغًا إذا لم تعرف.",
    },
  };
  const normalize = (s) =>
    String(s)
      .normalize("NFKC")
      .trim()
      .toLowerCase()
      .replace(/[أإآ]/g, "ا")
      .replace(/[\s_-]+/g, "");
  const digits = (s) =>
    String(s)
      .replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 1632))
      .replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 1776));
  function numeric(value) {
    let s = digits(value).trim().replace(/٫/g, ".").replace(/٬/g, ",");
    if (!/^[+-]?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(s)) return null;
    const n = Number(s.replaceAll(",", ""));
    return Number.isFinite(n) && Math.abs(n) <= 1e12 ? n : null;
  }
  function date(value) {
    const s = digits(value).trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
    const [y, m, d] = s.split("-").map(Number);
    if (
      y < 1900 ||
      y > 2100 ||
      m < 1 ||
      m > 12 ||
      d < 1 ||
      d > new Date(Date.UTC(y, m, 0)).getUTCDate()
    )
      return null;
    return s;
  }
  function parse(text) {
    text = String(text).replace(/^\uFEFF/, "");
    if (!text.trim())
      throw new Error(
        "الملف فارغ. أضف عناوين الأعمدة وسجلًا واحدًا على الأقل.",
      );
    if (text.includes("\u0000"))
      throw new Error(
        "الملف ليس CSV بترميز UTF-8. أعد تصديره بالترميز الصحيح.",
      );
    let quoted = false;
    const counts = { ",": 0, ";": 0, "\t": 0 };
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === '"') {
        if (quoted && text[i + 1] === '"') i++;
        else quoted = !quoted;
      } else if (!quoted) {
        if (c === "\n" || c === "\r") break;
        if (c in counts) counts[c]++;
      }
    }
    const delimiter = Object.keys(counts).sort(
      (a, b) => counts[b] - counts[a],
    )[0];
    const records = [];
    let row = [],
      cell = "",
      inQuote = false,
      closed = false,
      line = 1,
      start = 1;
    const pushCell = () => {
      row.push(cell);
      cell = "";
      closed = false;
      if (row.length > 50) throw new Error("الحد الأقصى ٥٠ عمودًا لكل ملف.");
    };
    const pushRow = () => {
      pushCell();
      if (row.some((v) => v.trim())) records.push({ cells: row, line: start });
      row = [];
      if (records.length > 10001)
        throw new Error("الحد الأقصى ١٠٬٠٠٠ سجل. قسّم الملف إلى ملفات أصغر.");
    };
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (inQuote) {
        if (c === '"') {
          if (text[i + 1] === '"') {
            cell += '"';
            i++;
          } else {
            inQuote = false;
            closed = true;
          }
        } else {
          cell += c;
          if (c === "\n") line++;
        }
      } else if (c === delimiter) pushCell();
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        pushRow();
        line++;
        start = line;
      } else if (c === '"') {
        if (cell !== "" || closed)
          throw new Error(
            "علامة اقتباس غير صحيحة قرب السطر " +
              line +
              ". أعد تصدير الملف بصيغة CSV.",
          );
        inQuote = true;
      } else if (closed) {
        if (c !== " " && c !== "\t")
          throw new Error(
            "فاصل غير صحيح بعد علامة الاقتباس قرب السطر " + line + ".",
          );
      } else cell += c;
      if (cell.length > 20000)
        throw new Error("إحدى الخلايا طويلة جدًا. الحد ٢٠٬٠٠٠ حرف للخلية.");
    }
    if (inQuote)
      throw new Error("يوجد نص بعلامة اقتباس غير مغلقة في نهاية الملف.");
    if (cell !== "" || row.length || closed) pushRow();
    if (records.length < 2)
      throw new Error(
        "الملف يحتوي على عناوين فقط. أضف سجلًا واحدًا على الأقل.",
      );
    const headers = records.shift().cells.map((v) => v.trim());
    if (headers.length < 2)
      throw new Error(
        "لم نتعرف على أعمدة متعددة. استخدم الفاصلة أو الفاصلة المنقوطة أو Tab.",
      );
    if (headers.some((h) => !h))
      throw new Error(
        "يوجد عنوان عمود فارغ. سمّ جميع الأعمدة وأعد اختيار الملف.",
      );
    if (new Set(headers.map(normalize)).size !== headers.length)
      throw new Error("توجد أسماء أعمدة مكررة. اجعل لكل عمود اسمًا مختلفًا.");
    return { headers, rows: records, delimiter };
  }
  function suggest(type, headers) {
    const mapping = {};
    for (const key of schemas[type].fields) {
      const aliases = fields[key][1].split(",").map(normalize);
      mapping[key] = headers.findIndex((h) => aliases.includes(normalize(h)));
    }
    if (type === "costs" && mapping.totalCost >= 0) mapping.unitCost = -1;
    return mapping;
  }
  function validate(type, parsed, mapping, knownCodes = null) {
    const schema = schemas[type],
      issues = [],
      valid = [],
      invalid = [],
      seen = new Map();
    const missing = schema.required.filter(
      (k) => mapping[k] === undefined || mapping[k] < 0,
    );
    if (missing.length)
      throw new Error(
        "طابق الحقول المطلوبة: " +
          missing.map((k) => fields[k][0]).join("، ") +
          ".",
      );
    const used = schema.fields.map((k) => mapping[k]).filter((v) => v >= 0);
    if (new Set(used).size !== used.length)
      throw new Error(
        "لا يمكن استخدام العمود نفسه لأكثر من حقل. راجع المطابقة.",
      );
    if (type === "costs" && mapping.unitCost >= 0 === mapping.totalCost >= 0)
      throw new Error(
        "اختر عمود تكلفة الوحدة أو تكلفة الوحدات المباعة، وليس كليهما.",
      );
    const numbers = [
      "qty",
      "sales",
      "unitCost",
      "totalCost",
      "opening",
      "incoming",
      "used",
      "waste",
      "adjustment",
      "amount",
    ];
    for (const record of parsed.rows) {
      const values = {};
      let bad = false;
      const issue = (level, key, message) => {
        issues.push({
          level,
          line: record.line,
          field: fields[key]?.[0] || key,
          message,
        });
        if (level === "error") bad = true;
      };
      if (record.cells.length !== parsed.headers.length) {
        issue("error", "الأعمدة", "عدد الخلايا لا يطابق عدد عناوين الأعمدة.");
        invalid.push(record);
        continue;
      }
      for (const key of schema.fields) {
        const index = mapping[key];
        const raw = index >= 0 ? record.cells[index].trim() : "";
        values[key] = raw;
        if (!raw) {
          if (
            schema.required.includes(key) ||
            (type === "costs" &&
              index >= 0 &&
              ["unitCost", "totalCost"].includes(key))
          )
            issue("error", key, "القيمة مطلوبة.");
          else if (key === "adjustment") values[key] = 0;
          continue;
        }
        if (numbers.includes(key)) {
          const n = numeric(raw);
          if (n === null)
            issue(
              "error",
              key,
              "استخدم رقمًا صالحًا دون رمز عملة؛ مثال 1250.50.",
            );
          else if (n < 0 && key !== "adjustment")
            issue(
              "error",
              key,
              "القيمة سالبة؛ هذا القالب يقبل القيم غير السالبة فقط.",
            );
          else values[key] = n;
        }
        if (key === "date") {
          const d = date(raw);
          if (!d)
            issue(
              "error",
              key,
              "تاريخ غير صالح. استخدم YYYY-MM-DD، مثال 2026-09-01.",
            );
          else values.date = d;
        }
        if (key === "period") {
          const p = digits(raw);
          if (!/^\d{4}-\d{2}$/.test(p) || !date(p + "-01"))
            issue(
              "error",
              key,
              "استخدم شهرًا صالحًا بصيغة YYYY-MM، مثال 2026-09.",
            );
          else values.period = p;
        }
        if (
          key === "recurring" &&
          ![
            "شهري",
            "متكرر",
            "غيرمتكرر",
            "نعم",
            "لا",
            "monthly",
            "recurring",
            "oneoff",
            "true",
            "false",
            "yes",
            "no",
            "1",
            "0",
          ].includes(normalize(raw))
        )
          issue(
            "warning",
            key,
            "التكرار غير معروف. سيظل بحاجة لتصنيف قبل التحليل.",
          );
      }
      if (
        !bad &&
        type === "inventory" &&
        values.opening +
          values.incoming -
          values.used -
          values.waste +
          (values.adjustment || 0) <
          0
      )
        issue(
          "error",
          "opening",
          "حركة المخزون تنتج رصيد نهاية سالبًا. راجع الوارد والاستهلاك والهدر والتسويات.",
        );
      if (!bad) {
        const period =
          type === "costs" ? values.period : values.date.slice(0, 7);
        if (type === "costs" && knownCodes && !knownCodes.has(values.code))
          issue(
            "warning",
            "code",
            "الرمز غير موجود في ملف المبيعات المجهز لهذا الشهر. راجع الربط قبل التحليل.",
          );
        const fingerprint = JSON.stringify(schema.fields.map((k) => values[k]));
        if (seen.has(fingerprint))
          issue(
            "warning",
            "السجل",
            "يشابه السجل في السطر " +
              seen.get(fingerprint) +
              ". لن يُحذف تلقائيًا.",
          );
        else seen.set(fingerprint, record.line);
        valid.push({ ...record, values, period });
      } else invalid.push(record);
    }
    const periods = [...new Set(valid.map((r) => r.period))].sort();
    if (periods.length > 1)
      throw new Error(
        "السجلات المقبولة تغطي أكثر من شهر. قسّم الملف إلى ملف مستقل لكل شهر ثم أعد رفعه.",
      );
    if (type === "costs" && !knownCodes && valid.length)
      issues.push({
        level: "warning",
        line: null,
        field: "ربط المنتجات",
        message:
          "لم يتوفر ملف مبيعات مجهز لهذا الشهر لمراجعة رموز المنتجات. أضف المبيعات وراجع المطابقة قبل ربط التحليل.",
      });
    if (type === "expenses" && valid.some((r) => !r.values.category))
      issues.push({
        level: "warning",
        line: null,
        field: "التصنيف",
        message: "بعض المصروفات بلا تصنيف؛ ستبقى غير مصنفة حتى مراجعتها.",
      });
    return { valid, invalid, issues, period: periods[0] || null };
  }
  function template(type, period = "2026-09") {
    const rows = {
      sales: [
        ["date", "product_code", "name", "qty", "net_sales"],
        [period + "-01", "PR-001", "برجر دجاج", 10, 300],
        [period + "-02", "PR-002", "باستا الدجاج", 5, 200],
      ],
      costs: [
        ["period", "product_code", "total_cost"],
        [period, "PR-001", 200],
        [period, "PR-002", 75],
      ],
      inventory: [
        [
          "date",
          "item_code",
          "name",
          "unit",
          "opening",
          "incoming",
          "used",
          "waste",
          "adjustment",
          "unit_cost",
        ],
        [period + "-28", "ST-001", "دجاج", "كجم", 80, 200, 180, 0, 0, 40],
        [period + "-28", "ST-002", "خضار", "كجم", 60, 180, 120, 80, 0, 10],
      ],
      expenses: [
        ["date", "name", "amount", "vendor", "category", "recurring"],
        [period + "-01", "إيجار المحل", 3500, "الجهة المؤجرة", "إيجار", "شهري"],
        [
          period + "-12",
          "اشتراك إدارة الطلبات",
          500,
          "مقدم الخدمة",
          "اشتراكات",
          "شهري",
        ],
      ],
    };
    return (
      "\uFEFF" +
      rows[type]
        .map((row) =>
          row.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(","),
        )
        .join("\r\n")
    );
  }
  return { fields, schemas, parse, suggest, validate, template, numeric, date };
})();
