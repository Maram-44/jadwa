# Architecture — React

React 19 + Vite 8، JavaScript/JSX. لا backend أو Router أو مكتبة حركة أو Three.js جديدة.

`src/app/main.jsx` يختار feature بحسب اسم ملف HTML ويحملها ديناميكيًا. تسعة مداخل HTML حقيقية: index, login, register, dashboard, opportunities, products, expenses, data-hub, meeting. الروابط والتحديث المباشر والتاريخ تعمل عبر المتصفح، وحالات الصفحة المؤقتة تبقى بعمر الصفحة كما في الأصل. لم نفرض SPA لأنها ستغيّر عزل CSS وعمر الحالات دون حاجة.

الميزات تحت `src/features/`: landing, auth, dashboard, opportunities, catalog, expenses, data-hub, meeting. كل feature تمتلك Page ومكوناتها ومنطقها الخاص. `shared/ui` يحتوي Sidebar وDialog وSelect وجدول البيانات والعملة. `shared/data` يحتوي البيانات والحسابات المشتركة المستخدمة في عدة صفحات. `shared/lib` يحتوي query/loading/toast/workspace/session.

ملفات View هي JSX صريح يحافظ على DOM الأصلي، مع slots وbindings للحقول والمحتوى المتغير. لا تحليل HTML في وقت التشغيل ولا dangerouslySetInnerHTML. إعدادات CSS الأصلية محفوظة في public/styles بدون تغيير؛ كل مدخل يحمل ملفاته الأصلية. الأصول المحلية الأصلية تحت public/assets، ونسخة بجوار CSS لصيانة الروابط النسبية.

الغرفة: MeetingPage يمتلك canvas/control state. renderer/adapter.js يتولى WebGL فقط، ويبلغ React بحالة الجاهزية والكاميرا والحركة. تهيئة قابلة للإلغاء، تنظيف RAF/ResizeObserver/listeners/موارد GPU، واستعادة context. shaders وmotion.js وبيانات scene من المصدر الأصلي. public/room/scene.json.gz يُفك محليًا في المتصفح.

التوثيق الأصلي كاملًا: history/v25-docs/ARCHITECTURE.md.
