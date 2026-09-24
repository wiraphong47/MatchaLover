import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const background = path.join(
  root,
  "public",
  "coupon-background-matcha12-v1.png",
);
const output = path.join(
  root,
  "public",
  "matcha-mori-coupon-matcha12-1200x628.png",
);

const overlay = Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="628" viewBox="0 0 1200 628">
  <defs>
    <linearGradient id="leftFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fffdf6" stop-opacity="0.99"/>
      <stop offset="0.80" stop-color="#fffdf6" stop-opacity="0.96"/>
      <stop offset="1" stop-color="#fffdf6" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <rect x="18" y="18" width="1164" height="592" rx="30" fill="none" stroke="#49683c" stroke-width="3"/>
  <path d="M22 48a30 30 0 0 1 30-30h650v592H52a30 30 0 0 1-30-30z" fill="url(#leftFade)"/>

  <g transform="translate(62 55)">
    <path d="M0 22C8 5 24-2 43 0c-5 18-18 29-39 28" fill="none" stroke="#5d7d43" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5 26L36 6" fill="none" stroke="#5d7d43" stroke-width="4" stroke-linecap="round"/>
    <text x="58" y="22" fill="#173b2a" font-family="Leelawadee UI, Tahoma, sans-serif" font-size="27" font-weight="700" letter-spacing="1">MATCHA MORI</text>
    <text x="58" y="46" fill="#6c7c69" font-family="Leelawadee UI, Tahoma, sans-serif" font-size="15">มัทฉะแท้ คุณภาพพรีเมียม</text>
  </g>

  <rect x="62" y="126" width="207" height="35" rx="17" fill="#e3eaca"/>
  <text x="165" y="150" text-anchor="middle" fill="#436137" font-family="Leelawadee UI, Tahoma, sans-serif" font-size="15" font-weight="700" letter-spacing="1.5">WELCOME COUPON</text>

  <text x="62" y="225" fill="#173b2a" font-family="Leelawadee UI, Tahoma, sans-serif" font-size="49" font-weight="700">คูปองส่วนลด</text>
  <text x="62" y="315" fill="#4e7339" font-family="Leelawadee UI, Tahoma, sans-serif" font-size="91" font-weight="800">ลด 12%</text>
  <text x="65" y="357" fill="#3f5142" font-family="Leelawadee UI, Tahoma, sans-serif" font-size="23">สำหรับสินค้ามัทฉะทุกชนิด</text>

  <rect x="62" y="384" width="490" height="64" rx="16" fill="#173b2a"/>
  <text x="86" y="424" fill="#dce8b1" font-family="Leelawadee UI, Tahoma, sans-serif" font-size="18">รหัสคูปอง</text>
  <line x1="208" y1="397" x2="208" y2="435" stroke="#718d67" stroke-width="1"/>
  <text x="232" y="426" fill="#fffdf5" font-family="Leelawadee UI, Tahoma, sans-serif" font-size="30" font-weight="800" letter-spacing="3">MATCHA12</text>

  <g transform="translate(62 476)">
    <circle cx="13" cy="12" r="11" fill="#dce8b1"/>
    <path d="M13 6v7l5 3" fill="none" stroke="#436137" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="36" y="19" fill="#24422f" font-family="Leelawadee UI, Tahoma, sans-serif" font-size="19" font-weight="700">ใช้ได้ 1 ต.ค. – 31 ธ.ค. 2569</text>
  </g>

  <line x1="62" y1="517" x2="586" y2="517" stroke="#bac5a6" stroke-width="1"/>
  <text x="62" y="549" fill="#4f5d50" font-family="Leelawadee UI, Tahoma, sans-serif" font-size="15.5">• ยอดขั้นต่ำ 500 บาท   • ใช้ได้ 1 ครั้งต่อบัญชี</text>
  <text x="62" y="577" fill="#4f5d50" font-family="Leelawadee UI, Tahoma, sans-serif" font-size="15.5">• ไม่รวมค่าจัดส่ง   • ใช้ร่วมกับโปรโมชันอื่นไม่ได้</text>

  <circle cx="1182" cy="314" r="16" fill="#f4efe3"/>
  <circle cx="18" cy="314" r="16" fill="#f4efe3"/>
</svg>
`);

await sharp(background)
  .resize(1200, 628, { fit: "cover", position: "center" })
  .composite([{ input: overlay, top: 0, left: 0 }])
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(output);

const metadata = await sharp(output).metadata();
console.log(`${output} ${metadata.width}x${metadata.height}`);
