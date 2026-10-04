# Animation parity

| الحركة | الموقع الحالي | الحفظ والتحقق |
|---|---|---|
| قطع الشعار والكلمة | landing/hooks/useLandingMotion.js | 560ms/130ms، الكلمة 460ms/350ms، نفس clips والأصل؛ المقدمة ظهرت وانتهت في Chrome |
| انتقال الشعار وإزالة الستار | نفس hook | 760ms من 950ms، الستار 650ms، نهاية1900ms، حماية3000ms؛ source review |
| مرة لكل جلسة، التخطي وEscape | نفس hook | jadwa-intro-v1 محفوظ، cleanup آمن في StrictMode؛ مصدرراجع |
| دخول الهيرو | public/styles/landing.css + page-enter | CSS الأصلي دون تغيير |
| كشف العناصر بالسكرول | useLandingMotion | threshold .12 وmargin -32px وتأخير min(index×90,270)؛ عناصر مستقلة والكيبورد يكشفها |
| صورة الغرفة والhover/focus | ملفات CSS الأصلية | نفس scale والمسافات والتوقيت؛ معاينة CSS محفوظة |
| انتقال التبويب | usePanelMotion | 240ms fade + translateY(5px)؛ تبديل المنتجات/المصروفات جُرّب |
| skeleton | shared/ui/primitives.jsx + useLoading | 650ms الرئيسية،550ms الفرص،500ms المنتجات/المصروفات،250ms مركز البيانات |
| دخول الحسابات | public/styles/auth.css | .65s و.85s والتأخير .1s محفوظة |
| ترحيب ورفع اليد والتلويح | meeting/renderer/motion.js وmotion.glsl | نفس الوضعيات والأوقات، اختبارات sample والساعة؛ العرض المتحرك غير متحقق بصريًا لغياب WebGL |
| الرمش والرأس والنبات والغصن | نفس المصدر | نفس دورة23.7s وفواصل الرمش، IDs والمحاور محفوظة |
| كرات نيوتن | renderer/adapter.js + renderer.js/shaders | نفس damping والدورة1.2s، تفعيل مستقل بالزر/hit test؛ فحص المصدر وmock lifecycle |
| إخفاء التبويب واستئنافه | adapter.js + createRoomMotionClock | الساعة تتوقف بلا قفزة؛ اختبار ناجح |
| reduced motion | CSS، landing hook، room adapter | المنطق الأصلي محفوظ ومراجع؛ لم يُجرَ تدقيق بصري مستقل بتغيير إعداد النظام |

اللون والظل يشتركان في motion.glsl ذاته. تنظيف observers وlisteners وRAF وGPU اختُبر بمحاكاة mount/dispose/remount؛ لا يثبت ذلك أداء GPU حقيقيًا. لا lip-sync أو حالة استماع مزيفة.
