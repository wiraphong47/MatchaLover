import test from "node:test";
import assert from "node:assert/strict";
import { products } from "../data/products.js";
import { inferMenu, inferMenus, recommendMatcha } from "./recommendations.js";
test("multiple uses form a union without duplicate products and still obey budget", () => {
  const result = recommendMatcha(products, { menus: ["latte", "baking"], budget: "400" });
  assert.deepEqual(result.map(p => p.name), ["Premium Blend", "Culinary Grade"]);
  const overlapping = recommendMatcha(products, { menus: ["pure", "latte"] });
  assert.equal(overlapping.filter(p => p.name === "Ujihikari Matcha").length, 1);
});
test("all saved interests are recognized and clearing overrides profile defaults", () => {
  assert.deepEqual(inferMenus("ชงเพียว ลาเต้ ทำขนม"), ["pure", "latte", "baking"]);
  assert.equal(recommendMatcha(products, { menus: [], note: "ลาเต้" }).length, products.length);
});
test("uses saved Thai and English preferences", () => {
  assert.equal(inferMenu("ชอบมัทฉะลาเต้"), "latte");
  assert.equal(inferMenu("baking"), "baking");
  assert.equal(inferMenu("ไม่ระบุ"), "");
});
test("filters latte recommendations within budget using actual catalog prices", () => {
  const result = recommendMatcha(products, { menu: "latte", budget: "400" });
  assert.deepEqual(
    result.map((p) => p.name),
    ["Premium Blend"]
  );
  assert.ok(result[0].reason.includes("ลาเต้"));
});
test("does not substitute unrelated products if no product fits", () => {
  assert.equal(
    recommendMatcha(products, { menu: "pure", budget: "100" }).length,
    0
  );
});
test("returns relevant baking products and all products when filters cleared", () => {
  assert.deepEqual(
    recommendMatcha(products, { menu: "baking" }).map((p) => p.name),
    ["Culinary Grade"]
  );
  assert.equal(recommendMatcha(products).length, products.length);
});
