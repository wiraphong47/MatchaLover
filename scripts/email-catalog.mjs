// Generated artifact: PHP email recommendations use the same products and rules as React.
import { writeFile, mkdir, copyFile } from "node:fs/promises";
import { products } from "../src/data/products.js";
import { matchaMenus, recommendMatcha } from "../src/utils/recommendations.js";
import { preferenceLabels, productTraits } from "../src/utils/rankMatcha.js";
const catalog = Object.fromEntries(
  matchaMenus.map(({ key }) => [key, recommendMatcha(products, { menu: key })])
);
await writeFile(
  new URL("../server-php/catalog.json", import.meta.url),
  JSON.stringify(catalog, null, 2) + "\n"
);
console.log("Updated PHP email catalog from current website products.");
await writeFile(
  new URL("../server-php/recommendation-rules.json", import.meta.url),
  JSON.stringify(
    {
      labels: preferenceLabels,
      traits: productTraits,
      productOrder: products.map(({ name }) => name),
    },
    null,
    2
  ) + "\n"
);
console.log("Updated PHP recommendation rules from the registration form.");
await mkdir(new URL("../server-php/assets/", import.meta.url), {
  recursive: true,
});
for (const product of products) {
  await copyFile(
    new URL("../public/" + product.image, import.meta.url),
    new URL("../server-php/assets/" + product.image, import.meta.url)
  );
}
console.log("Copied product images for PHPMailer CID attachments.");
