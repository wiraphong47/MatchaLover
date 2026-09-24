import { useEffect, useMemo, useRef, useState } from "react";
import { createOrder, resendOrderEmail } from "../services/orderService";
import { orderItemPayload } from "../utils/order";

const STORAGE_KEYS = {
  cart: "matcha-mori-cart",
  orders: "matcha-mori-orders",
  confirmedOrder: "matcha-mori-confirmed-order",
  pendingOrder: "matcha-mori-pending-order",
};

const readStoredValue = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
};

export default function useShop() {
  const [cart, setCart] = useState(() =>
    readStoredValue(STORAGE_KEYS.cart, [])
  );
  const [orders, setOrders] = useState(() =>
    readStoredValue(STORAGE_KEYS.orders, [])
  );
  const [couponCode, setCouponCode] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(() => {
    try {
      return JSON.parse(
        sessionStorage.getItem(STORAGE_KEYS.confirmedOrder) || "null"
      );
    } catch {
      return null;
    }
  });
  const [orderBusy, setOrderBusy] = useState(false);
  const [orderError, setOrderError] = useState("");
  const submittingOrder = useRef(false);
  const pendingOrderKey = useRef(null);

  useEffect(
    () => localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart)),
    [cart]
  );
  useEffect(
    () => localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders)),
    [orders]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );
  const couponApplied = couponCode.trim().toUpperCase() === "MATCHA12";

  const addToCart = (product) => {
    setCart((current) =>
      current.some((item) => item.name === product.name)
        ? current.map((item) =>
            item.name === product.name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...current, { ...product, quantity: 1 }]
    );
  };

  const addProductToCart = (product) => {
    const alreadyInCart = cart.some((item) => item.name === product.name);
    return alreadyInCart
      ? cart.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cart, { ...product, quantity: 1 }];
  };

  const changeQuantity = (name, amount) =>
    setCart((current) =>
      current
        .map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );

  const completeOrder = async ({
    method,
    slipFile,
    customer: orderCustomer,
    shippingAddress,
  }) => {
    if (submittingOrder.current) throw new Error("กำลังบันทึกคำสั่งซื้ออยู่");
    if (!cart.length) throw new Error("ไม่มีสินค้าในตะกร้า");
    submittingOrder.current = true;
    setOrderBusy(true);
    setOrderError("");
    try {
      const activeShipping = shippingAddress || {
        recipientName: orderCustomer?.name || "",
        phone: orderCustomer?.phone || "",
        address: orderCustomer?.address || "",
      };
      const items = cart.map(orderItemPayload);
      const fingerprint = JSON.stringify({
        items,
        couponCode: couponApplied ? "MATCHA12" : "",
        paymentMethod: method,
        shippingAddress: activeShipping,
      });
      let pending = null;
      try {
        pending = JSON.parse(
          sessionStorage.getItem(STORAGE_KEYS.pendingOrder) || "null"
        );
      } catch {
        pending = null;
      }
      if (!pending?.key || pending.fingerprint !== fingerprint) {
        pending = {
          key:
            globalThis.crypto?.randomUUID?.() ||
            `order-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          fingerprint,
        };
        sessionStorage.setItem(
          STORAGE_KEYS.pendingOrder,
          JSON.stringify(pending)
        );
      }
      pendingOrderKey.current = pending.key;
      const localItems = cart.map((item, index) => {
        const unitPrice = Number(String(item.price).replace(/,/g, ""));
        return {
          ...items[index],
          name: item.name,
          options: item.selectedMatcha
            ? { selectedMatcha: item.selectedMatcha }
            : {},
          unitPrice,
          lineTotal: unitPrice * item.quantity,
        };
      });
      const subtotal = localItems.reduce(
        (sum, item) => sum + item.lineTotal,
        0
      );
      const discount = couponApplied ? Math.round(subtotal * 0.12) : 0;
      const result = await createOrder({
        idempotencyKey: pending.key,
        items,
        couponCode: couponApplied ? "MATCHA12" : "",
        paymentMethod: method,
        slipFile,
        shippingAddress: activeShipping,
        customerEmail: orderCustomer?.email || "",
        localItems,
        subtotal,
        discount,
      });
      const order = {
        ...result.order,
        memberId: orderCustomer?.memberId || result.order.memberId || "",
        emailSent: result.emailSent,
      };
      setOrders((current) => [
        order,
        ...current.filter((item) => item.id !== order.id),
      ]);
      setConfirmedOrder(order);
      sessionStorage.setItem(
        STORAGE_KEYS.confirmedOrder,
        JSON.stringify(order)
      );
      setCart([]);
      setCouponCode("");
      pendingOrderKey.current = null;
      sessionStorage.removeItem(STORAGE_KEYS.pendingOrder);
      return order;
    } catch (error) {
      setOrderError(error.message || "บันทึกคำสั่งซื้อไม่สำเร็จ กรุณาลองใหม่");
      throw error;
    } finally {
      submittingOrder.current = false;
      setOrderBusy(false);
    }
  };

  const resendConfirmationEmail = async (orderId) => {
    const targetId = orderId || confirmedOrder?.id;
    if (!targetId) throw new Error("ไม่พบรหัสคำสั่งซื้อ");
    const result = await resendOrderEmail(targetId);
    if (result.emailSent === true) {
      setConfirmedOrder((prev) => {
        if (!prev || prev.id !== targetId) return prev;
        const updated = {
          ...prev,
          ...(result.order || {}),
          emailSent: true,
        };
        sessionStorage.setItem(
          STORAGE_KEYS.confirmedOrder,
          JSON.stringify(updated)
        );
        return updated;
      });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === targetId
            ? { ...o, ...(result.order || {}), emailSent: true }
            : o
        )
      );
    }
    return result;
  };

  return {
    addProductToCart,
    addToCart,
    cart,
    cartCount,
    changeQuantity,
    completeOrder,
    confirmedOrder,
    couponApplied,
    couponCode,
    orders,
    orderBusy,
    orderError,
    clearOrderError: () => setOrderError(""),
    resendConfirmationEmail,
    setCart,
    setCouponCode,
  };
}
