# โครงสร้างโฟลเดอร์ React มาตรฐาน

ใช้ MUI

```text
project-root/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/ หรือ views/
│   ├── hooks/
│   ├── services/ หรือ api/
│   ├── context/ หรือ store/
│   ├── utils/ หรือ helpers/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── .github/
├── .env
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## `public/`

เก็บไฟล์ static ที่เรียกใช้ผ่าน URL โดยตรง เช่น รูปสินค้า โลโก้ favicon หรือไฟล์ดาวน์โหลด

## `src/`

เก็บ source code หลักทั้งหมดของเว็บไซต์ React

## `src/assets/`

เก็บไฟล์ที่ต้อง import เข้า component โดยตรง เช่น SVG, icon, รูปเฉพาะส่วน หรือไฟล์ font

## `src/components/`

เก็บ component ที่ใช้ซ้ำได้หลายหน้า เช่น Button, Modal, Navbar, Footer, ProductCard

## `src/pages/` หรือ `src/views/`

เก็บ component ระดับหน้าเว็บ แต่ละไฟล์มักแทน 1 route เช่น HomePage, ProductsPage, AboutPage, ProductDetailPage

## `src/hooks/`

เก็บ Custom React Hooks สำหรับใช้ logic ซ้ำ เช่น `useCart`, `useAuth`, `useFetch`

## `src/services/` หรือ `src/api/`

เก็บโค้ดเชื่อมต่อระบบภายนอกหรือเรียก API เช่น Axios, Fetch, Firebase และการจัดการข้อมูลจาก server

## `src/context/` หรือ `src/store/`

เก็บ Global State ที่หลาย component ต้องใช้ร่วมกัน เช่น ข้อมูลผู้ใช้ ตะกร้าสินค้า ภาษา หรือธีมเว็บไซต์

## `src/utils/` หรือ `src/helpers/`

เก็บฟังก์ชันช่วยที่ไม่ใช่ UI และใช้ซ้ำได้ เช่น แสดงราคา แปลงวันที่ ตรวจสอบข้อมูล หรือจัดการ path ของรูปภาพ

## `src/styles/`

เก็บ CSS ส่วนกลาง เช่น reset, ตัวแปรสี, font, theme และไฟล์ style ที่ต้องใช้ร่วมกันหลายหน้า

## `src/App.jsx`

component หลักของเว็บไซต์ ใช้รวม layout หลัก, route หรือ provider ต่าง ๆ เข้าด้วยกัน

## `src/main.jsx`

Entry point ของ React มีหน้าที่นำ `<App />` ไป render ใน `<div id="root">` ของ `index.html`

## `.github/`

เก็บ workflow ของ GitHub Actions เช่น build, test และ deploy เว็บไซต์ขึ้น GitHub Pages

## `.env`

เก็บค่าตัวแปร environment เช่น API URL หรือ key ลับ ไม่ควรอัปขึ้น GitHub

## `.gitignore`

ระบุไฟล์และโฟลเดอร์ที่ Git ไม่ควรติดตาม เช่น `node_modules/`, `dist/` และ `.env`

## `index.html`

ไฟล์ HTML หลักที่มี `<div id="root">` สำหรับ React แสดงหน้าเว็บ

## `package.json`

เก็บชื่อโปรเจกต์, dependencies และคำสั่ง เช่น `npm run dev` กับ `npm run build`

## `vite.config.js`

ไฟล์ตั้งค่า Vite เช่น plugin ของ React, base path สำหรับ GitHub Pages และการตั้งค่า build
