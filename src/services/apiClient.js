const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
let csrf = "";

export function apiConfigured() { return Boolean(API_URL); }

export async function apiRequest(path, options = {}) {
  if (!API_URL) throw new Error("ยังไม่ได้ตั้งค่าการเชื่อมต่อระบบสมาชิก");
  if (!csrf && path !== "/session.php") await apiRequest("/session.php");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(csrf ? { "X-CSRF-Token": csrf } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (data.csrf) csrf = data.csrf;
  if (!response.ok) {
    const error = new Error(data.message || "เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่");
    error.code = data.code;
    error.status = response.status;
    throw error;
  }
  return data;
}

export function clearApiSession() { csrf = ""; }
