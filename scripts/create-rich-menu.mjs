import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const background = path.join(root, "public", "rich-menu-background-v1.png");
const output = path.join(root, "public", "matcha-mori-rich-menu-1200x810.png");

const menuItems = [
  {
    label: "SHOP",
    title: "สั่งซื้อสินค้า",
    subtitle: "เลือกมัทฉะและอุปกรณ์",
    icon: "bag",
    fill: "#173b2a",
    text: "#fffdf5",
    accent: "#d9e6a9",
  },
  {
    label: "FIND YOUR MATCHA",
    title: "มัทฉะที่ใช่สำหรับคุณ",
    subtitle: "แนะนำตามรสชาติที่ชอบ",
    icon: "matcha",
    fill: "#f8f4e9",
    text: "#173b2a",
    accent: "#789651",
  },
  {
    label: "MATCHA MORI MEMBER",
    title: "สมัครสมาชิก",
    subtitle: "รับสิทธิพิเศษและคะแนน",
    icon: "member",
    fill: "#637d48",
    text: "#fffdf5",
    accent: "#e4edbd",
  },
  {
    label: "NEWS &amp; OFFERS",
    title: "ข่าวสารและโปรโมชัน",
    subtitle: "ดีลใหม่จาก Matcha Mori",
    icon: "tag",
    fill: "#e8eed9",
    text: "#173b2a",
    accent: "#668248",
  },
  {
    label: "BREW GUIDE",
    title: "วิธีชงมัทฉะ",
    subtitle: "เคล็ดลับชงให้อร่อย",
    icon: "brew",
    fill: "#285039",
    text: "#fffdf5",
    accent: "#d9e6a9",
  },
  {
    label: "CONTACT US",
    title: "ติดต่อร้าน",
    subtitle: "สอบถามและสั่งซื้อ",
    icon: "chat",
    fill: "#eee2c8",
    text: "#173b2a",
    accent: "#9a7839",
  },
];

function iconMarkup(name, color) {
  const common = `fill="none" stroke="${color}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"`;
  const icons = {
    bag: `<g ${common}><path d="M-31 -17h62l-5 57h-52z"/><path d="M-17 -18c0-18 7-29 17-29s17 11 17 29"/><path d="M-11 8h22"/></g>`,
    matcha: `<g ${common}><path d="M-37 3h74c-3 27-17 39-37 39S-34 30-37 3z"/><path d="M-30 3c8 10 52 10 60 0"/><path d="M5-10c6-21 19-31 36-32-2 17-13 28-36 32z"/><path d="M2-11c10-8 20-16 31-23"/></g>`,
    member: `<g ${common}><circle cx="0" cy="-23" r="19"/><path d="M-38 42c2-28 16-44 38-44s36 16 38 44"/><path d="M-25 42h50"/></g>`,
    tag: `<g ${common}><path d="M-40-13v45l27 16 53-53-44-44z"/><circle cx="-14" cy="-24" r="6"/><path d="M-3 24l26-26"/><circle cx="-5" cy="0" r="5"/><circle cx="25" cy="24" r="5"/></g>`,
    brew: `<g ${common}><path d="M-35 0h60v19c0 20-12 29-30 29h-2c-18 0-28-9-28-29z"/><path d="M25 9h8c15 0 15 23 0 23h-9"/><path d="M-43 48h77"/><path d="M-13-10c-12-15 5-22-5-35M8-10c-12-15 5-22-5-35"/></g>`,
    chat: `<g ${common}><path d="M-41-39h82v57c0 12-9 21-21 21h-29l-24 17 5-17h-13z"/><path d="M-21-5h42M-21 12H9"/></g>`,
  };
  return icons[name];
}

const margin = 18;
const gap = 12;
const cardWidth = 380;
const cardHeight = 381;

const cards = menuItems
  .map((item, index) => {
    const column = index % 3;
    const row = Math.floor(index / 3);
    const x = margin + column * (cardWidth + gap);
    const y = margin + row * (cardHeight + gap);
    const centerX = x + cardWidth / 2;
    const titleSize = item.title.length > 18 ? 31 : 38;
    return `
      <g>
        <rect x="${x}" y="${y}" width="${cardWidth}" height="${cardHeight}" rx="30"
          fill="${item.fill}" fill-opacity="0.96" stroke="${item.accent}" stroke-opacity="0.62" stroke-width="2"/>
        <circle cx="${centerX}" cy="${y + 111}" r="58" fill="${item.accent}" fill-opacity="0.13"/>
        <g transform="translate(${centerX} ${y + 111})">${iconMarkup(item.icon, item.accent)}</g>
        <text x="${centerX}" y="${y + 201}" text-anchor="middle" fill="${item.accent}"
          font-family="Leelawadee UI, Tahoma, sans-serif" font-size="16" font-weight="700" letter-spacing="2">${item.label}</text>
        <text x="${centerX}" y="${y + 256}" text-anchor="middle" fill="${item.text}"
          font-family="Leelawadee UI, Tahoma, sans-serif" font-size="${titleSize}" font-weight="700">${item.title}</text>
        <line x1="${centerX - 32}" y1="${y + 278}" x2="${centerX + 32}" y2="${y + 278}"
          stroke="${item.accent}" stroke-width="3" stroke-linecap="round"/>
        <text x="${centerX}" y="${y + 320}" text-anchor="middle" fill="${item.text}" fill-opacity="0.78"
          font-family="Leelawadee UI, Tahoma, sans-serif" font-size="20">${item.subtitle}</text>
      </g>`;
  })
  .join("");

const overlay = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="810" viewBox="0 0 1200 810">
    <rect width="1200" height="810" fill="#f5f0e4" fill-opacity="0.18"/>
    ${cards}
  </svg>
`);

await sharp(background)
  .resize(1200, 810, { fit: "cover", position: "center" })
  .composite([{ input: overlay, top: 0, left: 0 }])
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(output);

const metadata = await sharp(output).metadata();
console.log(`${output} ${metadata.width}x${metadata.height}`);
