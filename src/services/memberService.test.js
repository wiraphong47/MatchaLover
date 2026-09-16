import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { SourceTextModule, SyntheticModule, createContext } from "node:vm";

async function service({ configured = true, response = {} } = {}) {
  const calls = [];
  let cleared = false;
  const context = createContext({});
  const dependency = new SyntheticModule(
    ["apiConfigured", "apiRequest", "clearApiSession"],
    function () {
      this.setExport("apiConfigured", () => configured);
      this.setExport("apiRequest", async (...args) => { calls.push(args); return response; });
      this.setExport("clearApiSession", () => { cleared = true; });
    },
    { context }
  );
  const module = new SourceTextModule(await readFile(new URL("./memberService.js", import.meta.url), "utf8"), { context });
  await module.link(() => dependency);
  await module.evaluate();
  return { api: module.namespace, calls, wasCleared: () => cleared };
}

test("registration sends the complete member form to PHP", async () => {
  const form = { email: "test@example.com", password: "secret123", consent: true };
  const { api, calls } = await service({ response: { session: true } });
  await api.registerMember(form);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "/register.php");
  assert.equal(calls[0][1].method, "POST");
  assert.equal(calls[0][1].body, JSON.stringify(form));
});

test("login and profile save use dedicated endpoints", async () => {
  const login = { email: "test@example.com", password: "secret123" };
  const profile = { name: "Test", phone: "0800000000" };
  const { api, calls } = await service({ response: { customer: profile } });
  await api.loginMember(login);
  assert.deepEqual(await api.saveMember(null, profile), profile);
  assert.equal(calls[0][0], "/login.php");
  assert.equal(calls[1][0], "/profile.php");
  assert.equal(calls[1][1].method, "PUT");
});

test("logout clears the local CSRF token after server logout", async () => {
  const fixture = await service();
  await fixture.api.logoutMember();
  assert.equal(fixture.calls[0][0], "/logout.php");
  assert.equal(fixture.wasCleared(), true);
});

test("missing API configuration returns a signed-out session", async () => {
  const { api, calls } = await service({ configured: false });
  assert.equal((await api.getMemberSession()).customer, null);
  assert.equal(calls.length, 0);
});

test("authentication errors are translated for customers", async () => {
  const { api } = await service();
  assert.equal(api.authMessage({ code: "invalid_credentials" }), "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  assert.equal(api.authMessage({ code: "user_already_exists" }), "อีเมลนี้สมัครแล้ว กรุณาเข้าสู่ระบบ");
});
