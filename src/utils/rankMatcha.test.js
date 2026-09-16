import test from "node:test";
import assert from "node:assert/strict";
import { products } from "../data/products.js";
import { rankMatcha, profileSelection, selectionNote } from "./rankMatcha.js";
test("budget remains hard while tastes rank soft matches", () => {
  const result = rankMatcha(products, ["latte", "nutty"], "700");
  assert.equal(result[0].name, "Okumidori Matcha");
  assert.ok(result.every((p) => Number(p.price) <= 700));
  assert.ok(
    result.some(
      (p) => p.name === "Premium Blend" && p.unconfirmed.includes("nutty")
    )
  );
});
test("unknown aroma is not fabricated and matches retain stable catalog order", () => {
  const result = rankMatcha(products, ["roasted"]);
  assert.ok(
    result.every(
      (p) => p.matched.length === 0 && p.unconfirmed.includes("roasted")
    )
  );
  assert.equal(result[0].name, products[0].name);
});
test("profile round trip preserves groups and free text", () => {
  const note = selectionNote("ชอบลองชาใหม่", ["pure", "strong", "nutty"]);
  assert.deepEqual(profileSelection({ note }), ["pure", "strong", "nutty"]);
  assert.ok(note.includes("ชอบลองชาใหม่"));
  assert.equal(selectionNote(note, []), "ชอบลองชาใหม่");
});
test("no budget matches returns empty and mixed uses never duplicate", () => {
  assert.equal(rankMatcha(products, ["pure"], "100").length, 0);
  const result = rankMatcha(products, ["pure", "latte"]);
  assert.equal(result.length, new Set(result.map((p) => p.name)).size);
});
