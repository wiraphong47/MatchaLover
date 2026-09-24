import { recommendMatcha, inferMenus } from "./recommendations.js";
import { interestGroups, selectedInterestKeys } from "./matchaInterests.js";

// Curated only from note/detail/taste/aroma in products.js. Missing tags mean
// insufficient catalog evidence, not proof that the product lacks the trait.
export const productTraits = {
  "Ceremonial Grade": [
    "smooth",
    "umami",
    "texture-silky",
    "level-regular",
    "level-enthusiast",
    "occasion-relax",
    "occasion-special",
  ],
  "Premium Blend": [
    "strong",
    "umami",
    "fragrant",
    "texture-creamy",
    "level-beginner",
    "level-regular",
    "occasion-daily",
    "occasion-cafe",
  ],
  "Culinary Grade": [
    "strong",
    "texture-rich",
    "level-beginner",
    "level-regular",
    "occasion-cafe",
  ],
  "Asahi Matcha": [
    "smooth",
    "umami",
    "texture-silky",
    "level-enthusiast",
    "occasion-relax",
    "occasion-special",
  ],
  "Gokou Matcha": [
    "strong",
    "nutty",
    "texture-rich",
    "level-enthusiast",
    "occasion-special",
  ],
  "Okumidori Matcha": [
    "smooth",
    "umami",
    "low-bitter",
    "nutty",
    "fresh",
    "texture-creamy",
    "level-beginner",
    "level-regular",
    "occasion-daily",
    "occasion-cafe",
  ],
  "Samidori Matcha": [
    "strong",
    "bitter",
    "texture-rich",
    "level-regular",
    "level-enthusiast",
    "occasion-special",
  ],
  "Ujihikari Matcha": [
    "smooth",
    "nutty",
    "delicate",
    "texture-silky",
    "level-beginner",
    "level-regular",
    "occasion-daily",
    "occasion-relax",
  ],
  "Yabukita Matcha": [
    "light",
    "fresh",
    "texture-light",
    "level-beginner",
    "occasion-daily",
    "occasion-relax",
  ],
};
export const preferenceLabels = Object.fromEntries(
  interestGroups.flatMap((g) => g.options).map((o) => [o.key, o.label])
);
export function profileSelection(customer) {
  return [
    ...new Set([
      ...selectedInterestKeys(customer?.note),
      ...inferMenus(customer?.note),
    ]),
  ];
}
export function selectionNote(note = "", selected = []) {
  const known = Object.values(preferenceLabels);
  // Preserve free-text notes when updating the structured choices.
  const extra = note
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s && !known.includes(s) && !inferMenus(s).length);
  return [
    ...selected.map((key) => preferenceLabels[key]).filter(Boolean),
    ...extra,
  ].join(", ");
}
export function rankMatcha(products, selected = [], budget = "") {
  const menus = selected.filter((key) =>
    ["pure", "latte", "baking"].includes(key)
  );
  const traits = selected.filter(
    (key) => !menus.includes(key) && preferenceLabels[key]
  );
  return recommendMatcha(products, { menus, budget })
    .map((product) => {
      const tags = productTraits[product.name] || [];
      const matched = traits.filter((key) => tags.includes(key));
      const unconfirmed = traits.filter((key) => !tags.includes(key));
      return { ...product, matched, unconfirmed, score: matched.length };
    })
    .sort((a, b) => b.score - a.score);
}
