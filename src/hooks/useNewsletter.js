import { useState } from "react";
export default function useNewsletter() {
  const [form, setForm] = useState({
    email: "",
    menu: "latte",
    consent: false,
    website: "",
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const endpoint = import.meta.env.VITE_NEWSLETTER_API_URL;
  const change = (key, value) => setForm((old) => ({ ...old, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    if (!endpoint) {
      setMessage({
        severity: "info",
        text: "ระบบรับข่าวสารกำลังเตรียมเปิดให้บริการ",
      });
      return;
    }
    if (!form.consent) {
      setMessage({ severity: "error", text: "กรุณายินยอมรับข่าวสารก่อน" });
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const configuredEndpoint = endpoint.replace(/\/$/, "");
      const localPhpEndpoint = "http://127.0.0.1:8080";
      const isThisComputer =
        window.location.protocol === "file:" ||
        ["", "localhost", "127.0.0.1"].includes(window.location.hostname);
      // On the development computer, contact PHP directly. This avoids a
      // proxy/origin mismatch that can reject a valid subscription before the
      // mail handler is reached. Keep the configured route as a fallback.
      const candidates =
        endpoint.startsWith("/") && isThisComputer
          ? [localPhpEndpoint, configuredEndpoint]
          : [configuredEndpoint];
      if (
        endpoint.startsWith("/") &&
        !isThisComputer &&
        !candidates.includes(localPhpEndpoint)
      ) {
        candidates.push(localPhpEndpoint);
      }
      let response;
      let lastError;
      for (const candidate of candidates) {
        try {
          response = await fetch(`${candidate}/subscribe.php`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
            signal: AbortSignal.timeout(60000),
          });
          if (response.ok || response.status === 429) break;
          // These responses happen before SMTP is reached, so it is safe to
          // retry through the fallback route without sending twice.
          if (![400, 403, 404, 405].includes(response.status)) break;
        } catch (failure) {
          lastError = failure;
        }
      }
      if (!response)
        throw lastError || new Error("เชื่อมต่อระบบส่งอีเมลไม่ได้");
      if (response.status === 429) {
        setMessage({
          severity: "warning",
          text: "มีการส่งคำขอถี่เกินไป ระบบยังไม่ได้เพิ่มอีเมลนี้ กรุณารอสักครู่แล้วลองอีกครั้ง",
        });
        return;
      }
      if (!response.ok) {
        let detail = null;
        try {
          detail = await response.json();
        } catch {
          // Keep the friendly fallback below when the server returned HTML.
        }
        throw new Error(
          detail?.message === "Service temporarily unavailable"
            ? "ระบบส่งอีเมลขัดข้องชั่วคราว กรุณาลองใหม่อีกครั้ง"
            : "ระบบยังรับคำขอไม่ได้ กรุณารอสักครู่แล้วลองใหม่",
        );
      }
      setMessage({
        severity: "success",
        text: "ส่งอีเมลเรียบร้อยแล้ว กรุณาตรวจกล่องจดหมาย โปรโมชั่น และสแปม",
      });
      setForm((old) => ({ ...old, email: "", consent: false }));
    } catch (error) {
      setMessage({
        severity: "warning",
        text:
          error.name === "TimeoutError"
            ? "การส่งอีเมลใช้เวลานานเกินไป กรุณารอสักครู่แล้วตรวจกล่องจดหมาย"
            : error.message,
      });
    } finally {
      setBusy(false);
    }
  };
  return { form, busy, message, change, submit, configured: Boolean(endpoint) };
}
