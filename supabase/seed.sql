-- ====================================================================
-- Jadwa (جدوى) Seed Data Migration
-- File: supabase/seed.sql
-- Description: Realistic Saudi business seed data for Jadwa.
-- ====================================================================

-- Function to seed demo account data for a given user UUID
CREATE OR REPLACE FUNCTION public.seed_jadwa_user_data(target_user_id UUID)
RETURNS void AS $$
BEGIN
    -- 1. Profile
    INSERT INTO public.profiles (id, email, full_name, business_name, business_type, role, avatar_initial)
    VALUES (
        target_user_id,
        'demo@jadwa.app',
        'الشيماء',
        'منشأتي',
        'مقهى ومطعم',
        'مالكة المنشأة',
        'ش'
    ) ON CONFLICT (id) DO NOTHING;

    -- 2. Business Periods
    INSERT INTO public.business_periods (user_id, period_key, month_code, name, year, revenue, cost, profit, potential_saving, weekly_sales, weekly_costs, changes)
    VALUES
    (
        target_user_id,
        '2026-09',
        'sep',
        'سبتمبر',
        2026,
        48000.00,
        36000.00,
        12000.00,
        2500.00,
        '[9000, 12000, 15000, 12000]'::jsonb,
        '[7500, 8500, 10500, 9500]'::jsonb,
        '["+١٥٪", "+٨٪", "+٤٢٪"]'::jsonb
    ),
    (
        target_user_id,
        '2026-08',
        'aug',
        'أغسطس',
        2026,
        41740.00,
        33333.00,
        8407.00,
        2100.00,
        '[8500, 9740, 12500, 11000]'::jsonb,
        '[7000, 7833, 9500, 9000]'::jsonb,
        '["+١٠٪", "+٦٪", "+٣١٪"]'::jsonb
    )
    ON CONFLICT (user_id, period_key) DO NOTHING;

    -- 3. Opportunities for September
    INSERT INTO public.opportunities (user_id, period_key, opportunity_index, category, title, description, icon, accent_color, tint_color, potential_saving, evidence, steps, calculation, source, status)
    VALUES
    (
        target_user_id,
        '2026-09',
        0,
        'هدر المخزون',
        'قلّل هدر المكونات',
        'تكرر الهدر في ٣ مكونات خلال الشهر.',
        'box',
        '#0d9977',
        '#ebf9f3',
        1200.00,
        'في عينة البيانات التوضيحية، تم رصد كميات غير مستخدمة من الخضار ومنتجات الألبان والمخبوزات. التقدير مبني على الجزء القابل للتقليل من تكلفة الهدر المسجل.',
        '["راجع كميات الشراء مقابل الاستهلاك الفعلي لكل مكون.", "ابدأ بدفعات شراء أصغر للمكونات قصيرة الصلاحية.", "قارن تكلفة الهدر بعد أسبوعين بخط الأساس."]'::jsonb,
        'إجمالي هدر مسجل قدره ١٬٦٠٠ ⃁ × نسبة خفض مفترضة ٧٥٪ = ١٬٢٠٠ ⃁ وفر محتمل.',
        'سجل المخزون والهدر · بنود الهدر الشهرية',
        'new'
    ),
    (
        target_user_id,
        '2026-09',
        1,
        'تكلفة المنتجات',
        'راجع تكلفة الأصناف',
        'ارتفعت تكلفة صنفين مقارنة بالشهر السابق.',
        'tag',
        '#b9810b',
        '#fff7e4',
        800.00,
        'توضح عينة تكاليف الأصناف ارتفاع تكلفة مكونات صنفين. فرصة التحسين تخص المشتريات المستهلكة في المبيعات، وتستبعد تكلفة الهدر لتجنب احتساب الوفر مرتين.',
        '["تحقق من تكلفة الوحدة والكميات في فواتير المورد.", "قارن عرضًا بديلًا مع الحفاظ على الجودة المطلوبة.", "حدّث تكلفة الوصفة بعد اعتماد سعر الشراء الجديد."]'::jsonb,
        '٢٠٠ وحدة × خفض مفترض قدره ٤ ⃁ في تكلفة الوحدة = ٨٠٠ ⃁ وفر محتمل.',
        'المشتريات وتكاليف الوصفات · تكلفة الوحدات المباعة',
        'new'
    ),
    (
        target_user_id,
        '2026-09',
        2,
        'المصروفات',
        'راجع الاشتراكات المتكررة',
        'خدمات متشابهة ضمن المصروفات الشهرية.',
        'file',
        '#0896b4',
        '#eaf8fc',
        500.00,
        'تحتوي عينة المصروفات على اشتراكين لخدمات متشابهة. التشابه يستحق المراجعة لكنه لا يعني أن أحد الاشتراكين غير ضروري.',
        '["راجع استخدام الفريق لكل خدمة قبل الإلغاء.", "تحقق من شروط الإلغاء وتاريخ التجديد.", "أوقف الخدمة الزائدة إذا تأكد عدم الحاجة إليها."]'::jsonb,
        'اشتراك بقيمة ٥٠٠ ⃁ شهريًا × شهر واحد، بشرط إمكانية الإلغاء دون رسوم.',
        'سجل المصروفات · بند البرمجيات والاشتراكات',
        'new'
    )
    ON CONFLICT (user_id, period_key, opportunity_index) DO NOTHING;

    -- Opportunities for August
    INSERT INTO public.opportunities (user_id, period_key, opportunity_index, category, title, description, icon, accent_color, tint_color, potential_saving, evidence, steps, calculation, source, status)
    VALUES
    (
        target_user_id,
        '2026-08',
        0,
        'هدر المخزون',
        'قلّل هدر المكونات',
        'تكرر الهدر في ٣ مكونات خلال الشهر.',
        'box',
        '#0d9977',
        '#ebf9f3',
        1000.00,
        'رصد كميات غير مستخدمة من الخضار والألبان في شهر أغسطس.',
        '["راجع كميات الشراء مقابل الاستهلاك الفعلي.", "ابدأ بدفعات شراء أصغر للمكونات قصيرة الصلاحية."]'::jsonb,
        'تقدير توضيحي لشهر أغسطس بقيمة ١٬٠٠٠ ⃁.',
        'سجل المخزون والهدر',
        'new'
    ),
    (
        target_user_id,
        '2026-08',
        1,
        'تكلفة المنتجات',
        'راجع تكلفة الأصناف',
        'ارتفعت تكلفة صنفين مقارنة بالفترات السابقة.',
        'tag',
        '#b9810b',
        '#fff7e4',
        650.00,
        'ارتفاع في تكلفة مكونات البرجر والباستا.',
        '["تحقق من تكلفة الوحدة في الفواتير.", "قارن أسعار الموردين البدلاء."]'::jsonb,
        'تقدير توضيحي لشهر أغسطس بقيمة ٦٥٠ ⃁.',
        'المشتريات وتكاليف الوصفات',
        'new'
    ),
    (
        target_user_id,
        '2026-08',
        2,
        'المصروفات',
        'راجع الاشتراكات المتكررة',
        'خدمات متشابهة ضمن المصروفات الشهرية.',
        'file',
        '#0896b4',
        '#eaf8fc',
        450.00,
        'تكرار اشتراكات إدارة الطلبات.',
        '["راجع استخدام الفريق لكل خدمة قبل التجديد."]'::jsonb,
        'اشتراك بقيمة ٤٥٠ ⃁ شهريًا.',
        'سجل المصروفات',
        'new'
    )
    ON CONFLICT (user_id, period_key, opportunity_index) DO NOTHING;

    -- 4. Products & Metrics
    INSERT INTO public.products (user_id, code, name, group_name, parts, stock_refs, opportunity_refs)
    VALUES
    (target_user_id, 'PR-001', 'برجر دجاج', 'وجبات', '[["المكونات", 17], ["التغليف", 3]]'::jsonb, '["chicken", "bread", "tomatoes"]'::jsonb, '[1]'::jsonb),
    (target_user_id, 'PR-002', 'باستا الدجاج', 'وجبات', '[["المكونات", 13], ["التغليف", 2]]'::jsonb, '["chicken", "milk"]'::jsonb, '[1]'::jsonb),
    (target_user_id, 'PR-003', 'سلطة خضراء', 'وجبات', '[["المكونات", 18.875], ["التغليف", 3]]'::jsonb, '["tomatoes"]'::jsonb, '[0]'::jsonb),
    (target_user_id, 'PR-004', 'قهوة إسبريسو', 'مشروبات', null, '[]'::jsonb, '[]'::jsonb),
    (target_user_id, 'PR-005', 'لاتيه', 'مشروبات', '[["القهوة والحليب", 6], ["الكوب والتغليف", 2], ["التحضير المباشر", 4]]'::jsonb, '["milk", "coffee", "cups"]'::jsonb, '[0]'::jsonb),
    (target_user_id, 'PR-006', 'مافن الشوكولاتة', 'مخبوزات', '[["المكونات", 9.5], ["التغليف", 2]]'::jsonb, '["milk"]'::jsonb, '[0]'::jsonb)
    ON CONFLICT (user_id, code) DO NOTHING;

    -- Product Metrics
    INSERT INTO public.product_period_metrics (user_id, product_id, period_key, qty, sales, cost)
    SELECT target_user_id, p.id, '2026-09',
        CASE p.code
            WHEN 'PR-001' THEN 400
            WHEN 'PR-002' THEN 200
            WHEN 'PR-003' THEN 160
            WHEN 'PR-004' THEN 600
            WHEN 'PR-005' THEN 400
            WHEN 'PR-006' THEN 200
        END,
        CASE p.code
            WHEN 'PR-001' THEN 12000.00
            WHEN 'PR-002' THEN 8000.00
            WHEN 'PR-003' THEN 4000.00
            WHEN 'PR-004' THEN 12000.00
            WHEN 'PR-005' THEN 10000.00
            WHEN 'PR-006' THEN 2000.00
        END,
        CASE p.code
            WHEN 'PR-001' THEN 8000.00
            WHEN 'PR-002' THEN 3000.00
            WHEN 'PR-003' THEN 3500.00
            WHEN 'PR-004' THEN 3600.00
            WHEN 'PR-005' THEN 4800.00
            WHEN 'PR-006' THEN 2300.00
        END
    FROM public.products p
    WHERE p.user_id = target_user_id
    ON CONFLICT (user_id, product_id, period_key) DO NOTHING;

    INSERT INTO public.product_period_metrics (user_id, product_id, period_key, qty, sales, cost)
    SELECT target_user_id, p.id, '2026-08',
        CASE p.code
            WHEN 'PR-001' THEN 350
            WHEN 'PR-002' THEN 180
            WHEN 'PR-003' THEN 145
            WHEN 'PR-004' THEN 550
            WHEN 'PR-005' THEN 300
            WHEN 'PR-006' THEN 190
        END,
        CASE p.code
            WHEN 'PR-001' THEN 10500.00
            WHEN 'PR-002' THEN 7200.00
            WHEN 'PR-003' THEN 3625.00
            WHEN 'PR-004' THEN 11000.00
            WHEN 'PR-005' THEN 7500.00
            WHEN 'PR-006' THEN 1915.00
        END,
        CASE p.code
            WHEN 'PR-001' THEN 6475.00
            WHEN 'PR-002' THEN 2430.00
            WHEN 'PR-003' THEN 3000.00
            WHEN 'PR-004' THEN 3300.00
            WHEN 'PR-005' THEN 3400.00
            WHEN 'PR-006' THEN 2100.00
        END
    FROM public.products p
    WHERE p.user_id = target_user_id
    ON CONFLICT (user_id, product_id, period_key) DO NOTHING;

    -- 5. Inventory Items
    INSERT INTO public.inventory_items (user_id, code, name, unit, lead_time_days, target_stock_days, opportunity_refs)
    VALUES
    (target_user_id, 'ST-001', 'دجاج', 'كجم', 5, 12, '[1]'::jsonb),
    (target_user_id, 'ST-002', 'خضار طازجة', 'كجم', 2, 10, '[0]'::jsonb),
    (target_user_id, 'ST-003', 'حليب', 'لتر', 3, 7, '[0]'::jsonb),
    (target_user_id, 'ST-004', 'خبز', 'قطعة', 2, 4, '[0]'::jsonb),
    (target_user_id, 'ST-005', 'أكواب ورقية', 'قطعة', 4, 20, '[]'::jsonb),
    (target_user_id, 'ST-006', 'حبوب قهوة', 'كجم', 7, 30, '[]'::jsonb),
    (target_user_id, 'ST-007', 'شراب منكّه', 'زجاجة', 7, 30, '[]'::jsonb)
    ON CONFLICT (user_id, code) DO NOTHING;

    -- Inventory Metrics September
    INSERT INTO public.inventory_period_metrics (user_id, item_id, period_key, unit_cost, previous_cost, opening, incoming, used, waste, adjustment)
    SELECT target_user_id, i.id, '2026-09',
        CASE i.code
            WHEN 'ST-001' THEN 40.00 WHEN 'ST-002' THEN 10.00 WHEN 'ST-003' THEN 8.00
            WHEN 'ST-004' THEN 3.00 WHEN 'ST-005' THEN 2.00 WHEN 'ST-006' THEN 200.00 WHEN 'ST-007' THEN 30.00
        END,
        CASE i.code
            WHEN 'ST-001' THEN 36.80 WHEN 'ST-002' THEN 10.00 WHEN 'ST-003' THEN 7.50
            WHEN 'ST-004' THEN 3.00 WHEN 'ST-005' THEN 2.00 WHEN 'ST-006' THEN 200.00 WHEN 'ST-007' THEN 30.00
        END,
        CASE i.code
            WHEN 'ST-001' THEN 80.00 WHEN 'ST-002' THEN 60.00 WHEN 'ST-003' THEN 100.00
            WHEN 'ST-004' THEN 120.00 WHEN 'ST-005' THEN 200.00 WHEN 'ST-006' THEN 20.00 WHEN 'ST-007' THEN 30.00
        END,
        CASE i.code
            WHEN 'ST-001' THEN 200.00 WHEN 'ST-002' THEN 180.00 WHEN 'ST-003' THEN 420.00
            WHEN 'ST-004' THEN 600.00 WHEN 'ST-005' THEN 1000.00 WHEN 'ST-006' THEN 40.00 WHEN 'ST-007' THEN 0.00
        END,
        CASE i.code
            WHEN 'ST-001' THEN 180.00 WHEN 'ST-002' THEN 120.00 WHEN 'ST-003' THEN 430.00
            WHEN 'ST-004' THEN 600.00 WHEN 'ST-005' THEN 900.00 WHEN 'ST-006' THEN 18.00 WHEN 'ST-007' THEN 0.00
        END,
        CASE i.code
            WHEN 'ST-001' THEN 0.00 WHEN 'ST-002' THEN 80.00 WHEN 'ST-003' THEN 62.50
            WHEN 'ST-004' THEN 100.00 WHEN 'ST-005' THEN 0.00 WHEN 'ST-006' THEN 0.00 WHEN 'ST-007' THEN 0.00
        END,
        0.00
    FROM public.inventory_items i
    WHERE i.user_id = target_user_id
    ON CONFLICT (user_id, item_id, period_key) DO NOTHING;

    -- Inventory Metrics August
    INSERT INTO public.inventory_period_metrics (user_id, item_id, period_key, unit_cost, previous_cost, opening, incoming, used, waste, adjustment)
    SELECT target_user_id, i.id, '2026-08',
        CASE i.code
            WHEN 'ST-001' THEN 36.80 WHEN 'ST-002' THEN 10.00 WHEN 'ST-003' THEN 7.50
            WHEN 'ST-004' THEN 3.00 WHEN 'ST-005' THEN 2.00 WHEN 'ST-006' THEN 200.00 WHEN 'ST-007' THEN 30.00
        END,
        CASE i.code
            WHEN 'ST-001' THEN 36.80 WHEN 'ST-002' THEN 10.00 WHEN 'ST-003' THEN 7.50
            WHEN 'ST-004' THEN 3.00 WHEN 'ST-005' THEN 2.00 WHEN 'ST-006' THEN 200.00 WHEN 'ST-007' THEN 30.00
        END,
        64.00, 160.00, 144.00,
        CASE i.code WHEN 'ST-002' THEN 64.00 WHEN 'ST-003' THEN 50.00 WHEN 'ST-004' THEN 80.00 ELSE 0.00 END,
        0.00
    FROM public.inventory_items i
    WHERE i.user_id = target_user_id
    ON CONFLICT (user_id, item_id, period_key) DO NOTHING;

    -- 6. Expenses
    INSERT INTO public.expenses (user_id, period_key, category, name, vendor, amount, day_of_month, expense_date, recurring, renew_day, opportunity_ref, description)
    VALUES
    (target_user_id, '2026-09', 'rent', 'إيجار المحل', 'الجهة المؤجرة', 3500.00, 1, '2026-09-01', true, null, null, 'إيجار مساحة المحل عن شهر واحد. مسجل ضمن التشغيل فقط.'),
    (target_user_id, '2026-09', 'payroll', 'رواتب الإدارة والتشغيل', 'فريق التشغيل', 3000.00, 28, '2026-09-28', true, null, null, 'رواتب تشغيلية غير محملة على تكلفة المنتج.'),
    (target_user_id, '2026-09', 'utilities', 'استهلاك الكهرباء', 'مقدم خدمات الكهرباء', 650.00, 8, '2026-09-08', true, null, null, 'تكلفة الكهرباء المسجلة للفترة.'),
    (target_user_id, '2026-09', 'utilities', 'استهلاك المياه', 'مقدم خدمات المياه', 350.00, 9, '2026-09-09', true, null, null, 'تكلفة المياه الخاصة بالتشغيل خلال الشهر.'),
    (target_user_id, '2026-09', 'software', 'اشتراك إدارة الطلبات أ', 'مقدم الخدمة أ', 500.00, 12, '2026-09-12', true, 12, 2, 'اشتراك شهري لإدارة الطلبات. توجد خدمة أخرى مشابهة.'),
    (target_user_id, '2026-09', 'software', 'اشتراك إدارة الطلبات ب', 'مقدم الخدمة ب', 400.00, 18, '2026-09-18', true, 18, 2, 'اشتراك شهري إضافي لإدارة الطلبات.'),
    (target_user_id, '2026-09', 'marketing', 'حملة إعلانية شهرية', 'منصة الإعلانات', 800.00, 22, '2026-09-22', false, null, null, 'إنفاق إعلاني غير ملزم بالتجديد.'),
    -- August Expenses
    (target_user_id, '2026-08', 'rent', 'إيجار المحل', 'الجهة المؤجرة', 3500.00, 1, '2026-08-01', true, null, null, 'إيجار مساحة المحل.'),
    (target_user_id, '2026-08', 'payroll', 'رواتب الإدارة والتشغيل', 'فريق التشغيل', 4000.00, 28, '2026-08-28', true, null, null, 'رواتب تشغيلية.'),
    (target_user_id, '2026-08', 'utilities', 'استهلاك الكهرباء', 'مقدم خدمات الكهرباء', 1200.00, 8, '2026-08-08', true, null, null, 'تكلفة الكهرباء لشهر أغسطس.'),
    (target_user_id, '2026-08', 'utilities', 'استهلاك المياه', 'مقدم خدمات المياه', 500.00, 9, '2026-08-09', true, null, null, 'تكلفة المياه لشهر أغسطس.'),
    (target_user_id, '2026-08', 'software', 'اشتراك إدارة الطلبات أ', 'مقدم الخدمة أ', 450.00, 12, '2026-08-12', true, 12, 2, 'اشتراك إدارة الطلبات أ.'),
    (target_user_id, '2026-08', 'software', 'اشتراك إدارة الطلبات ب', 'مقدم الخدمة ب', 400.00, 18, '2026-08-18', true, 18, 2, 'اشتراك إدارة الطلبات ب.'),
    (target_user_id, '2026-08', 'marketing', 'حملة إعلانية شهرية', 'منصة الإعلانات', 1323.00, 22, '2026-08-22', false, null, null, 'إنفاق إعلاني لشهر أغسطس.');

END;
$$ LANGUAGE plpgsql;
