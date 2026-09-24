import { apiConfigured, apiRequest } from "./apiClient";

export async function createOrder(payload) {
  if (!apiConfigured()) {
    const id = globalThis.crypto?.randomUUID?.() || `order-${Date.now()}`;
    const orderNumber = `MM-${Date.now().toString().slice(-6)}`;
    return {
      order: {
        id,
        orderNumber,
        status: "pending_review",
        paymentMethod: payload.paymentMethod || "promptpay",
        paymentStatus: "pending",
        shippingAddress: payload.shippingAddress || {},
        customerName:
          payload.shippingAddress?.recipientName || "ลูกค้า Matcha Mori",
        customerEmail: payload.customerEmail || "",
        items: payload.localItems || [],
        subtotal: payload.subtotal || 0,
        discount: payload.discount || 0,
        shippingFee: 0,
        total: (payload.subtotal || 0) - (payload.discount || 0),
        couponCode: payload.couponCode || "",
        createdAt: new Date().toISOString(),
        createdAtLabel: new Date().toLocaleString("th-TH"),
      },
      emailSent: null,
    };
  }
  const {
    slipFile,
    localItems: _localItems,
    subtotal: _subtotal,
    discount: _discount,
    customerEmail: _customerEmail,
    ...order
  } = payload;
  const body = new FormData();
  body.append("order", JSON.stringify(order));
  body.append("slip", slipFile);
  return apiRequest("/orders.php", {
    method: "POST",
    body,
  });
}

export async function resendOrderEmail(orderId) {
  if (!apiConfigured()) {
    return {
      ok: true,
      emailSent: null,
      message: "โหมดทดลองใช้งาน (ไม่ได้เชื่อมต่อเซิร์ฟเวอร์ส่งอีเมล)",
    };
  }
  return apiRequest("/orders.php", {
    method: "POST",
    body: JSON.stringify({ action: "resend_email", orderId }),
  });
}
