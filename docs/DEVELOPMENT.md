# DEVELOPMENT — التشغيل والاستعادة والتصدير

## تشغيل الموقع كما هو

من جذر الحزمة: `python3 tools/serve.py` ثم http://localhost:8000 . على Windows استخدم `py` بدل `python3` إذا كان هذا أمر Python المتاح. يتطلب Python 3.8+ للخادم المرفق فقط. يمكن بدلًا منه تشغيل `python3 -m http.server 8000 --bind 127.0.0.1 --directory project/dist`.

الموقع نفسه لا يحتاج Python في الإنتاج. انشر محتويات project/dist على استضافة ملفات static مع الحفاظ على المسارات. يشير project/.openai/hosting.json إلى نفس Site الأصلي ولا يحتوي سرًا. لا تحاول نشر مشروع آخر على نفس المعرّف دون قصد تعديل الموقع الأصلي.

## الخطوط والاتصال

الخط عبر Google Fonts: IBM Plex Sans Arabic. الاتصال مطلوب لتحميله أول مرة؛ بدائل Tahoma/Arial معرفة في CSS. كل أصول الصورة والشعار والعملة والبيانات والمشهد اللازمة للموقع محلية. لا مفاتيح API مطلوبة. تشغيل الغرفة يحتاج WebGL1 وواجهات الويب الحديثة المستخدمة في review.html مثل DecompressionStream؛ عند تعذر العرض توجد صورة fallback. لا تضمن الحزمة واجهات ويب غير مدعومة في متصفح قديم.

## إعادة تصدير الغرفة بعد تعديل مصدرها

من project:

```sh
python3 scripts/export-meeting.py
```

يستخدم مكتبة Python القياسية فقط، ويعيد dist/meeting.html من المصادر الحالية. عند تغيير CSS/JS المشتركة لا حاجة لإعادة geometry، لكن تغير shaders/motion/review/scene يلزم معه التصدير. بعده افحص أن داخل meeting.html لا placeholders مثل __SCENE__ أو __MOTION__.

## تعديل هندسة الغرفة — اختياري

تحتاج numpy وPillow فقط لبناء geometry: `python3 -m pip install numpy Pillow` في بيئة تطوير مناسبة. ثم من project:

```sh
python3 design/meeting-room/source/build_layout.py
python3 scripts/export-meeting.py
```

هذا يعيد scene وبعض الصور والمخططات. خذ نسخة أو commit أولًا وراجع اختلافات الرندر. لا تعِد بناء المشهد لمجرد تشغيل الموقع؛ النسخة الناتجة جاهزة بالفعل. لا توجد نسخة Blender أصلية مفقودة من الحزمة؛ التنفيذ إجرائي في Python/WebGL.

## الرندر المطابق للـ shaders — اختياري وعلى Linux

render_egl.py يحتاج numpy وPillow وNode.js بالإضافة إلى مكتبة نظام libEGL.so.1 وبيئة GLES/EGL صالحة. تثبيت pip لا يثبت EGL. من project:

```sh
python3 design/meeting-room/source/render_egl.py --output-stem layout-camera
python3 design/meeting-room/source/render_egl.py --time 2 --output-stem greeting
python3 scripts/export-meeting.py
```

المعاملات الأخرى: --angle، --pitch، --swing. القياس الصحيح للحركة متوفر في motion.js. مخرجات الرندر ليست اختبار متصفح. الملف lighting-check.json يُكتب أثناء الرندر وقد يتغير؛ احتفظ بأدلة المراحل السابقة.

## أدوات تاريخية تحتاج الانتباه

- project/scripts/export-preview.py يستخدم وجهة مطلقة من بيئة الإنشاء؛ حُفظ دون تعديل حتى تبقى نسخة المصدر مطابقة. استخدم `python3 tools/export_preview_portable.py` من الحزمة لتصدير الديمو في `exports/Jadwa_Interactive_Preview.html`. هذا المصدر التاريخي يستعرض صفحات التطبيق الخمس، وليس بديلًا عن تشغيل اللاندنق/الحسابات/الغرفة كاملًا عبر الخادم.
- project/design/meeting-room/source/package_review.py أداة مراجعة تاريخية تغيّر metadata وتستدعي helper من plugin path خاص ببيئة الإنشاء. لا تحتاج تشغيلها للموقع ولا يوصى بها دون بيئتها. استخدم `python3 tools/export_room_review.py` لإخراج معاينة الغرفة من الموجود دون تعديل سجل المراجعات.
- ملفات docs السابقة داخل history تاريخية؛ CURRENT_STATE الحالية هي مرجع ما يعمل الآن.

## استعادة تاريخ Git

التاريخ محفوظ كـ bundle مستقل دون مجلد .git/config أو credentials. لاستعادة المستودع بالكامل من جذر الحزمة:

```sh
git clone history/jadwa-source-history.bundle jadwa-restored
```

النسخة المستعادة تحتوي ملفات المشروع الأصلية وتاريخه؛ docs/tools/references الإضافية تبقى في جذر حزمة التسليم. يمكن التحقق من bundle باستخدام `git bundle verify` داخل مستودع Git. تاريخ commits متوفر نصيًا في history/commits.txt.

## فحوص سابقة محفوظة

من project، يمكن تشغيل ملفات ../tools/qa/*.cjs باستخدام Node. هذه harnesses محلية تحاكي DOM/lifecycle وليست بديلًا عن الاختبار اليدوي للمتصفح. بعضها يركز على مصدر الحركة، وبعضها الحسابات أو المقدمة/التبويبات. لم تُضف dependencies للموقع لتشغيلها.

## تسليم لمطور أو وكيل جديد

أرسل الحزمة كاملة، واطلب قراءة README ثم docs الأربعة وPRODUCT_CONTEXT وANIMATIONS قبل أي تعديل. حافظ على المشروع الحالي واتجاه RTL والشعار والأنميشن والتصريح بالديمو. نفّذ الAPI لاحقًا في خادم مع صلاحيات منشأة ومراجع بيانات؛ لا تضع مفاتيح في frontend ولا تعد بتحليل فعلي أثناء عرض بيانات ثابتة.

## تشغيل React الحالي

من react-app: npm ci ثم npm run dev. الاختبارات npm test والبناء npm run build. مجلد dist الجديد ناتج بناء، ومصدر React تحت src. Node22.12+ مطلوب.

مصدر الغرفة الإجرائي ما زال في project/design/meeting-room. بعد تحديثه شغّل من react-app: npm run sync:room ثم npm test وnpm run build. الأداة تنقل scene/shaders/motion/textures ولا تغيّر JSX أو معمارية الصفحة.
