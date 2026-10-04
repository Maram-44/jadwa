import React from "react";
import ErrorBoundary from "./ErrorBoundary.jsx";
import { createRoot } from "react-dom/client";
const pages = {
  index: () => import("../features/landing/LandingPage.jsx"),
  login: () => import("../features/auth/AuthPage.jsx"),
  register: () => import("../features/auth/AuthPage.jsx"),
  dashboard: () => import("../features/dashboard/DashboardPage.jsx"),
  opportunities: () =>
    import("../features/opportunities/OpportunitiesPage.jsx"),
  products: () => import("../features/catalog/CatalogPage.jsx"),
  expenses: () => import("../features/expenses/ExpensesPage.jsx"),
  "data-hub": () => import("../features/data-hub/DataHubPage.jsx"),
  meeting: () => import("../features/meeting/MeetingPage.jsx"),
};
const name =
  location.pathname
    .split("/")
    .pop()
    .replace(/\.html$/, "") || "index";
const { default: Page } = await (pages[name] || pages.index)();
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Page mode={name} />
    </ErrorBoundary>
  </React.StrictMode>,
);
