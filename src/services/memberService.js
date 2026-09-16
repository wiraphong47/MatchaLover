import { apiConfigured, apiRequest, clearApiSession } from "./apiClient";

export function authMessage(error) {
  if (error?.code === "invalid_credentials") return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
  if (error?.code === "user_already_exists") return "อีเมลนี้สมัครแล้ว กรุณาเข้าสู่ระบบ";
  if (error?.status === 429) return "ส่งคำขอบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่";
  return error?.message || "เชื่อมต่อไม่สำเร็จ กรุณาลองใหม่";
}
export async function getMemberSession() {
  if (!apiConfigured()) return { customer: null };
  return apiRequest("/session.php");
}
export async function registerMember(form) {
  return apiRequest("/register.php", { method: "POST", body: JSON.stringify(form) });
}
export async function loginMember(credentials) {
  return apiRequest("/login.php", { method: "POST", body: JSON.stringify(credentials) });
}
export async function logoutMember() {
  await apiRequest("/logout.php", { method: "POST" }); clearApiSession();
}
export async function saveMember(_user, form) {
  const result = await apiRequest("/profile.php", { method: "PUT", body: JSON.stringify(form) });
  return result.customer;
}
export async function loadMember() {
  const result = await apiRequest("/profile.php"); return result.customer;
}
