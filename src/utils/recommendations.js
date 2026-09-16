export const matchaMenus = [
  { key: "pure", label: "ชงดื่มเพียว ๆ" },
  { key: "latte", label: "มัทฉะลาเต้" },
  { key: "baking", label: "ทำขนมและเครื่องดื่ม" },
];
export function inferMenu(note = "") {
  if (/latte|ลาเต้/i.test(note)) return "latte";
  if (/baking|ขนม|เบเกอรี่/i.test(note)) return "baking";
  if (/pure|เพียว|ชงดื่ม/i.test(note)) return "pure";
  return "";
}
export function inferMenus(note = "") {
  return [
    [/pure|เพียว|ชงดื่ม/i, "pure"],
    [/latte|ลาเต้/i, "latte"],
    [/baking|ขนม|เบเกอรี่/i, "baking"],
  ]
    .filter(([pattern]) => pattern.test(note))
    .map(([, key]) => key);
}
export function recommendMatcha(
  products,
  { menu = "", menus, budget = "", note = "" } = {}
) {
  // OR within the selected uses; AND with the maximum budget. Keep single-menu
  // callers compatible, including the PHP email catalog generator.
  const selected = menus ?? (menu ? [menu] : inferMenus(note));
  const patterns = {
    pure: /เพียว|ชงดื่ม/,
    latte: /ลาเต้/,
    baking: /เบเกอรี่|ขนม|ไอศกรีม/,
  };
  const selectedPatterns = selected.map((key) => patterns[key]).filter(Boolean);
  return products
    .filter((product) => {
      const price = Number(String(product.price).replaceAll(",", ""));
      return (
        (!selectedPatterns.length ||
          selectedPatterns.some((pattern) => pattern.test(product.use))) &&
        (!budget || price <= Number(budget))
      );
    })
    .map((product) => ({
      ...product,
      reason: `${product.use} — ${product.note}${budget ? ` · อยู่ในงบไม่เกิน ฿${Number(budget).toLocaleString("th-TH")}` : ""}`,
    }));
}
