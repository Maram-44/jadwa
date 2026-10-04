# Migration map

| الأصل داخل project | نسخة React داخل react-app |
|---|---|
| dist/index.html + landing.js | src/features/landing/LandingPage.jsx، components/IndexView.jsx، hooks/useLandingMotion.js، model/views.js |
| dist/login.html, register.html, auth.js | src/features/auth/AuthPage.jsx وcomponents |
| dist/dashboard.html + app.js | src/features/dashboard/DashboardPage.jsx وcomponents/DashboardView.jsx |
| dist/opportunities.html + opportunities.js | src/features/opportunities/OpportunitiesPage.jsx وcomponents |
| dist/products.html + products.js | src/features/catalog/CatalogPage.jsx وCatalogDetails.jsx |
| dist/expenses.html + expenses.js | src/features/expenses/ExpensesPage.jsx وExpenseDetails.jsx |
| dist/data-hub.html + data-hub.js | src/features/data-hub/DataHubPage.jsx، components، model/csv.js |
| dist/data.js, catalog.js, expenses-data.js | src/shared/data/demo.js, catalog.js, expenses.js |
| dist/dropdowns.js | src/shared/ui/Select.jsx مع portal وكيبورد |
| dist/meeting-session.js | src/shared/lib/session.js بنفس المفتاح والبنية |
| dist/meeting-page.js | src/features/meeting/MeetingPage.jsx |
| design/meeting-room/source/review.html | MeetingPage.jsx + renderer/adapter.js + public/styles/room.css |
| renderer.js, motion.js, shaders | src/features/meeting/renderer/ |
| scene.json، صورة الخارج وfallback | public/room/ |
| dist/*.css | public/styles/*.css — النسخ الأصلية محفوظة |
| dist/assets/ | public/assets/ وpublic/styles/assets/ |

المسارات التسعة وأسماء معاملات month/tab/item/opportunity/period/return/mode محفوظة. لا خدمات خفية أو وحدات backend. المصادر الإجرائية والمخططات والرندرات والمراجع والتاريخ بقيت تحت project/references/history.

إعادة توليد الغرفة: عدّل مصادر project حسب DEVELOPMENT ثم من react-app شغّل `npm run sync:room` وبعدها `npm test` و`npm run build`. لا تستخدم export-meeting.py لتوليد React JSX؛ هو لتصدير الأصل فقط.
