import test from "node:test";
import assert from "node:assert/strict";
import { orderItemPayload } from "./order.js";

test("normalizes matcha and tool cart items to stable catalog ids", () => {
  assert.deepEqual(
    orderItemPayload({ name: "Ceremonial Grade", quantity: 2 }),
    { productId: "matcha-ceremonial", quantity: 2 }
  );
  assert.deepEqual(orderItemPayload({ name: "ตะแกรงร่อนมัทฉะ", quantity: 1 }), {
    productId: "tool-4",
    quantity: 1,
  });
});

test("normalizes a package and its selected matcha", () => {
  assert.deepEqual(
    orderItemPayload({
      name: "Daily Matcha Set · Okumidori Matcha",
      selectedMatcha: "Okumidori Matcha",
      quantity: 1,
    }),
    {
      productId: "package-1",
      selectedMatchaId: "matcha-okumidori",
      quantity: 1,
    }
  );
});

test("rejects cart data that is not in the catalog", () => {
  assert.throws(
    () => orderItemPayload({ name: "Unknown product", quantity: 1 }),
    /ไม่พบสินค้า/
  );
});
