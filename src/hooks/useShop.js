import { useEffect, useMemo, useState } from "react";

const STORAGE_KEYS = {
  cart: "matcha-mori-cart",
  orders: "matcha-mori-orders",
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

  const completeOrder = ({
    total,
    discount,
    method,
    slipName,
    customer: orderCustomer,
  }) => {
    setOrders((current) => [
      {
        id: `MM${Date.now().toString().slice(-6)}`,
        total,
        discount,
        method,
        slipName,
        coupon: couponApplied ? "MATCHA12" : null,
        items: cart,
        createdAt: new Date().toLocaleDateString("th-TH"),
        customerName: orderCustomer?.name || "สมาชิก Matcha Mori",
        customerEmail: orderCustomer?.email || "",
        memberId: orderCustomer?.memberId || "",
      },
      ...current,
    ]);
    setCart([]);
    setCouponCode("");
  };

  return {
    addProductToCart,
    addToCart,
    cart,
    cartCount,
    changeQuantity,
    completeOrder,
    couponApplied,
    couponCode,
    orders,
    setCart,
    setCouponCode,
  };
}
