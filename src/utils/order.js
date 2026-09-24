import { products } from "../data/products.js";
import { brewTools, packages } from "../data/collections.js";

const catalog = [...products, ...packages, ...brewTools];

export const orderStatusLabels = {
  pending_payment: "รอหลักฐานการชำระเงิน",
  pending_review: "กำลังตรวจสอบการชำระเงิน",
  paid: "ชำระเงินแล้ว",
  shipped: "จัดส่งแล้ว",
  cancelled: "ยกเลิกแล้ว",
};

export const paymentMethodLabels = {
  promptpay: "พร้อมเพย์",
  bank_transfer: "โอนผ่านบัญชีธนาคาร",
};

export const paymentStatusLabels = {
  pending: "รอตรวจสอบ",
  verified: "ตรวจสอบแล้ว",
  rejected: "หลักฐานไม่ผ่านการตรวจสอบ",
};

const baseProductName = (item) =>
  item.selectedMatcha ? String(item.name).split(" · ")[0] : item.name;

export function orderItemPayload(item) {
  const product = item.id
    ? catalog.find((entry) => entry.id === item.id)
    : catalog.find((entry) => entry.name === baseProductName(item));
  if (!product) throw new Error(`ไม่พบสินค้า ${item.name} ในรายการสินค้า`);
  const selectedMatcha = item.selectedMatcha
    ? products.find(
        (entry) =>
          entry.id === item.selectedMatchaId ||
          entry.name === item.selectedMatcha
      )
    : null;
  if (item.selectedMatcha && !selectedMatcha)
    throw new Error(`ไม่พบมัทฉะ ${item.selectedMatcha} ที่เลือกในแพ็กเกจ`);
  return {
    productId: product.id,
    quantity: Number(item.quantity),
    ...(selectedMatcha ? { selectedMatchaId: selectedMatcha.id } : {}),
  };
}

export const money = (amount) =>
  `฿${Number(amount || 0).toLocaleString("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

export function formatOrderDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleString("th-TH", {
        dateStyle: "medium",
        timeStyle: "short",
      });
}
