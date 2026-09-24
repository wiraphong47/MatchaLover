# เชื่อม MySQL — ขั้นเตรียมฐานข้อมูล

สถานะ: ระบบสมาชิกและคำสั่งซื้อใช้ PHP/MySQL แล้ว พร้อมหน้าสรุปและอีเมลรับคำสั่งซื้อ

## 1. สร้างตารางและเพิ่มสินค้า

ใน MySQL Workbench เชื่อมต่อด้วย root แล้วเลือก File > Open SQL Script:

1. เปิด `mysql/schema.sql` แล้ว Execute ทั้งไฟล์
2. เปิด `mysql/catalog.sql` แล้ว Execute ทั้งไฟล์
3. Refresh SCHEMAS และตรวจว่ามี 15 ตารางใน `matcha_mori`

SQL สำหรับ MySQL 8.0.16 ขึ้นไปเท่านั้น
ไม่มี DROP/TRUNCATE หรือการลบข้อมูลลูกค้า การรัน catalog ซ้ำไม่เขียนทับสินค้าเดิม
CREATE TABLE IF NOT EXISTS ไม่ได้อัปเกรดโครงสร้างตารางที่มีชื่อเดียวกันแต่คอลัมน์ต่างกัน
schema.sql จะสร้างหรือปรับ view `member_overview` ตามนิยามในไฟล์
DDL ของ MySQL ไม่ rollback ทั้งไฟล์ หากมี error ให้หยุดและตรวจข้อความก่อน

## 2. สร้างผู้ใช้สำหรับ PHP (ไม่ใช้ root ในเว็บ)

ใน Workbench ไป Administration > Users and Privileges > Add Account:

- Login Name: `matcha_app`
- Limit to Hosts Matching: `127.0.0.1`
- ตั้งรหัสผ่านเฉพาะบัญชีนี้ด้วยตัวเอง ไม่ต้องส่งให้ผู้ช่วย
- Schema Privileges: เพิ่มเฉพาะ `matcha_mori` และให้ SELECT, INSERT, UPDATE, DELETE
- ไม่ให้สิทธิ์ผู้ดูแลระบบ, CREATE USER, DROP หรือ GRANT OPTION
- กด Apply

เปิด `server-php/mysql/config.local.php` แล้วกรอกรหัสบัญชี matcha_app ใน password
ไฟล์นี้ถูก Git ignore อย่าใส่รหัสใน VITE_* หรือในไฟล์ SQL ที่จะ commit
ถ้ารหัสมี single quote หรือ backslash ต้อง escape ให้ถูกตาม PHP string syntax

## 3. ทดสอบ (ใน Terminal ของโปรเจกต์)

```powershell
& 'C:\php\php.exe' 'server-php/mysql/check.php'
```

ควรได้ MySQL connected, 15 tables และ Products: 17
เครื่องมือนี้อ่านอย่างเดียว ไม่พิมพ์ข้อมูลลูกค้าหรือรหัสผ่าน และไม่ส่งอีเมล

ดูข้อมูลรวมใน Workbench สำหรับเจ้าของร้าน:

```sql
SELECT * FROM matcha_mori.member_overview;
```

ยอดสะสมใน view นับเฉพาะ paid/shipped; คะแนนมาจาก points_transactions
จึงไม่ให้คะแนนจากออร์เดอร์ที่ยังไม่ตรวจการชำระเงินจริง

## งานที่ต้องทำต่อหลังเชื่อมต่อสำเร็จ

ระบบสมาชิกขั้นพื้นฐานเชื่อม MySQL แล้ว เปิด API ใน Terminal หนึ่งหน้าต่างด้วย:

```powershell
npm run api
```

แล้วเปิดอีก Terminal ใช้ `npm run dev` สำหรับหน้าเว็บ ห้ามปิดหน้าต่าง API ขณะทดสอบ

- API สมัคร/เข้าสู่ระบบทำแล้ว: password_hash/password_verify, HttpOnly session cookie,
  ตรวจเจ้าของข้อมูลจาก session และ CSRF โดยไม่รับ member_id จาก browser มาเชื่อถือ
- ต้องเพิ่ม rate limit สำหรับ login/register และการยืนยันอีเมลก่อนเปิดให้บุคคลทั่วไปใช้
- ตั้งค่า SMTP/Composer บน PHP host และทดสอบอีเมลด้วยบัญชีที่ควบคุมก่อนเปิดใช้งานจริง
- เพิ่มหน้าหลังบ้านสำหรับตรวจสลิปและเปลี่ยนสถานะคำสั่งซื้อจาก `pending_review`
- ทดสอบข้อมูลสองบัญชีไม่ปะปนก่อนเปิดใช้จริง

หมายเหตุสินค้า: อุปกรณ์บางรายการในต้นฉบับมีชื่อ คำอธิบาย และราคาไม่ตรงกัน
เช่น ช้อนตักชาไม้ไผ่ในหน้าร้าน 350 บาท แต่ในแพ็กเกจ 190 บาท
จึงเก็บรายการแพ็กเกจตามต้นฉบับ ไม่จับคู่เป็นสินค้าเดียวกันเอง
ต้องตรวจข้อมูลนี้ก่อนเปิดคำนวณราคาแพ็กเกจจากฐานข้อมูล

GitHub Pages รัน PHP ไม่ได้ ต้องมีโฮสต์ PHP/MySQL ผ่าน HTTPS สำหรับเว็บจริง
อย่าเปิดพอร์ตฐานข้อมูล 3306 หรือเผยแพร่ config.local.php ออกอินเทอร์เน็ต
