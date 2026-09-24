# Matcha Mori PHP + MySQL

ระบบหลังบ้านใช้ MySQL `matcha_mori` ผ่านบัญชีจำกัดสิทธิ์ `matcha_app`
รหัสฐานข้อมูลอยู่ใน `mysql/config.local.php` ซึ่ง Git ไม่ติดตาม ห้ามใส่รหัสใน React หรือ `VITE_*`

## เปิดระบบในเครื่อง

เปิด Terminal สองหน้าต่างจากโฟลเดอร์โปรเจกต์:

```powershell
npm run api
npm run dev
```

API สมาชิกอยู่ที่ `http://127.0.0.1:8080/api` และใช้ HttpOnly session cookie กับ CSRF token
ระบบสมัคร เข้าสู่ระบบ ออกจากระบบ โหลดและแก้ไขโปรไฟล์เชื่อม MySQL แล้ว

ระหว่างทดสอบอีเมลในเครื่อง เปิด Terminal ที่สามไว้ด้วย:

```powershell
npm run mail:watch
```

ตัวเฝ้าคิวตรวจทุก 10 วินาที กด Ctrl+C เพื่อหยุด

## ข่าวสารและอีเมล

คัดลอกค่าจาก `config.example.env` ไปตั้งเป็น environment variables บน PHP host:

- `APP_KEY` ค่าสุ่มอย่างน้อย 32 ตัวอักษร
- `SITE_URL`, `API_URL`, `ALLOWED_ORIGINS`
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `MAIL_FROM`
- `WELCOME_START_AT`

ติดตั้ง PHPMailer ด้วย Composer:

```powershell
cd server-php
composer install --no-dev
```

ปลายทางเว็บที่เปิดเผยควรมีเฉพาะโฟลเดอร์ `public/` อย่าเปิดเผย `mysql/config.local.php`,
`worker.php`, assets ภายในระบบ หรือไฟล์ environment

ฟอร์ม `public/subscribe.php` บันทึกคำขอลง `newsletter_subscribers` และ `email_jobs`
ผู้รับต้องกดลิงก์ยืนยันก่อนสถานะเป็น `subscribed` การเปิดลิงก์แบบ GET จะแสดงแบบฟอร์มเท่านั้น
เพื่อลดความเสี่ยงจากโปรแกรมสแกนลิงก์ที่กดแทนผู้รับ

เรียก worker ผ่าน CLI/Task Scheduler นอก document root:

```powershell
C:\php\php.exe C:\path\to\project\server-php\worker.php
```

ส่งแคมเปญครั้งเดียวให้ผู้ยืนยันแล้ว:

```powershell
C:\php\php.exe C:\path\to\project\server-php\worker.php --campaign=campaign_2026_09
```

ก่อนส่งจริงต้องตั้ง SMTP, ติดตั้ง Composer, ใช้อีเมลที่ควบคุมเพื่อทดสอบ และตรวจทั้งกล่องเข้า/สแปม
อย่า commit รหัสผ่าน SMTP หรือฐานข้อมูล

อีเมลต้อนรับสมาชิกจะคัดสินค้า 3 ชิ้นจากตัวเลือกในหน้าสมัคร และแนบรูปขนาดเล็กสำหรับอีเมล
หากแก้สินค้า ป้ายความชอบ หรือกติกาการแนะนำ ให้สร้างข้อมูลอีเมลใหม่ด้วย:

```powershell
npm run email:catalog
```

ไฟล์รูปขนาดเล็กใน `assets/email-products/` ถูกเตรียมไว้เพื่อลดขนาดอีเมล ไม่ควรแทนด้วยรูปต้นฉบับขนาดใหญ่

## คำสั่งซื้อและอีเมลสรุป

หน้า Checkout ส่งรายการสินค้าและที่อยู่ไปที่ `public/api/orders.php` โดยราคาสินค้าและคูปอง
จะถูกตรวจและคำนวณใหม่จาก MySQL ฝั่งเซิร์ฟเวอร์ จากนั้นบันทึก `orders`, `order_items`
และ `payments` ภายใน transaction เดียว

หลักฐานการโอนรองรับ JPG, PNG, WEBP และ PDF ขนาดไม่เกิน 5 MB ไฟล์ถูกเปลี่ยนชื่อแบบสุ่ม
และเก็บนอกโฟลเดอร์ `public/` ที่ `storage/payment-slips/` ห้ามนำโฟลเดอร์นี้ไปเปิดเป็น URL สาธารณะ
PHP host ต้องมีสิทธิ์เขียนโฟลเดอร์ดังกล่าว

หลังบันทึกสำเร็จ ระบบส่งอีเมลสรุปไปยังอีเมลของสมาชิกทันทีด้วย SMTP และแสดงหน้าสรุปคำสั่งซื้อ
หาก SMTP ล้มเหลว คำสั่งซื้อจะยังคงถูกบันทึก และลูกค้าสามารถกดส่งอีเมลซ้ำจากหน้าสรุปได้
สถานะเริ่มต้นคือ `pending_review` ซึ่งหมายถึงร้านได้รับคำสั่งซื้อแล้วและยังต้องตรวจสอบหลักฐาน
ไม่ใช่การยืนยันว่าชำระเงินสำเร็จ

## ข้อจำกัดการเผยแพร่

GitHub Pages ให้บริการได้เฉพาะหน้า React และรัน PHP/MySQL ไม่ได้ เว็บจริงต้องมี PHP host
ที่เข้าถึง MySQL ผ่านเครือข่ายส่วนตัวหรือ localhost และใช้ HTTPS จากนั้นตั้ง Repository variable
`VITE_API_URL` และ `VITE_NEWSLETTER_API_URL` เป็น URL ของ host ดังกล่าว

ห้ามเปิดพอร์ต MySQL 3306 สู่สาธารณะ และต้องเพิ่ม rate limit สำหรับ login/register,
นโยบายสำรองข้อมูล และการตรวจสอบสลิปก่อนใช้งานจริง
