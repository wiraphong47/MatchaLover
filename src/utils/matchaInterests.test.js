import test from "node:test";
import assert from "node:assert/strict";
import { selectedInterestKeys, toggleInterestNote } from "./matchaInterests.js";
test("multiple preference groups survive selecting and deselecting", () => {
  let note = toggleInterestNote("", "latte");
  note = toggleInterestNote(note, "strong");
  note = toggleInterestNote(note, "nutty");
  assert.deepEqual(selectedInterestKeys(note), ["latte", "strong", "nutty"]);
  note = toggleInterestNote(note, "strong");
  assert.deepEqual(selectedInterestKeys(note), ["latte", "nutty"]);
});
test("keeps legacy notes and supports skipping all preferences", () => {
  assert.deepEqual(selectedInterestKeys(""), []);
  assert.equal(toggleInterestNote("ข้อความเดิม", "invalid"), "ข้อความเดิม");
  assert.ok(
    toggleInterestNote("ข้อความเดิม", "smooth").includes("ข้อความเดิม")
  );
});
