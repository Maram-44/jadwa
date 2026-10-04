import { Component } from "react";
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main dir="rtl" style={{ padding: 32 }}>
        <h1>تعذر عرض الصفحة</h1>
        <p>
          أعد تحميل الصفحة للمحاولة مرة أخرى. الملفات المجهزة مؤقتًا تبقى في هذا
          التبويب.
        </p>
        <button onClick={() => location.reload()}>إعادة المحاولة</button>
        <p>
          <a href="dashboard.html">العودة للرئيسية</a>
        </p>
      </main>
    );
  }
}
