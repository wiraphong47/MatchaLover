import { Box, Button, Chip, Divider, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

const money = (amount) => `฿${Number(amount || 0).toLocaleString("th-TH")}`;

export default function MemberDashboard({ customer, orders, onBack, onLogout, onSave }) {
  const [tab, setTab] = useState("profile");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(customer);
  useEffect(() => setForm(customer), [customer]);
  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total || 0), 0),
    [orders],
  );
  const points = Math.floor(totalSpent / 10) + 100;
  const memberId = `MM-${String(customer?.phone || "0000").slice(-4)}-${String(customer?.email || "member").length}`;
  const profileRows = [
    ["รหัสสมาชิก", memberId],
    ["อีเมล", customer?.email],
    ["เบอร์โทรศัพท์", customer?.phone],
    ["ที่อยู่จัดส่ง", customer?.address || "ยังไม่ได้ระบุ"],
    ["ความสนใจ", customer?.note || "ยังไม่ได้ระบุ"],
  ];
  const updateField = (field) => (event) => setForm({ ...form, [field]: event.target.value });
  const saveProfile = () => { onSave(form); setEditing(false); };

  return <Box component="main" sx={{ minHeight: "75vh", bgcolor: "#eee9dd", px: { xs: 2.5, md: "8vw" }, py: { xs: 4, md: 7 } }}>
    <Box sx={{ maxWidth: 1180, mx: "auto" }}>
      <Button onClick={onBack} sx={{ color: "#183b2a", px: 0, mb: 2 }}>← กลับหน้าหลัก</Button>
      <Box sx={{ bgcolor: "#fffdf9", borderRadius: { xs: 3, md: 5 }, p: { xs: 3, md: 5 }, boxShadow: "0 18px 50px rgba(31,52,37,.08)" }}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2}>
          <Box><Typography sx={{ color: "#a8874b", fontSize: 13, fontWeight: 700, letterSpacing: ".14em" }}>MATCHA MORI MEMBER</Typography><Typography variant="h1" sx={{ fontSize: { xs: 35, md: 46 }, mt: .5 }}>Member Portal & CDP Dashboard</Typography><Typography sx={{ color: "#607159", fontSize: 17, mt: .5 }}>ข้อมูลลูกค้า 360 องศา และประวัติการสั่งซื้อของคุณ</Typography></Box>
          <Chip label="● พร้อมใช้งาน" sx={{ alignSelf: { md: "start" }, bgcolor: "#e5eedc", color: "#547d3b", fontWeight: 700 }} />
        </Stack>
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 3, pb: 2.5, borderBottom: "1px solid #e2dbcb" }}>
          <Button onClick={() => setTab("profile")} variant={tab === "profile" ? "contained" : "outlined"} sx={tab === "profile" ? { bgcolor: "#183b2a" } : { color: "#183b2a", borderColor: "#cfc5b2" }}>ข้อมูลลูกค้า (CDP Profile)</Button>
          <Button onClick={() => setTab("orders")} variant={tab === "orders" ? "contained" : "outlined"} sx={tab === "orders" ? { bgcolor: "#183b2a" } : { color: "#183b2a", borderColor: "#cfc5b2" }}>ประวัติการสั่งซื้อ ({orders.length})</Button>
        </Stack>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3,1fr)" }, gap: 2, my: 3 }}>
          {[["สถานะสมาชิก", "VIP Green Member", "🌿"], ["คะแนนสะสม", `${points} Points`, "✦"], ["ยอดสั่งซื้อสะสม", money(totalSpent), "🛍️"]].map(([label, value, icon]) => <Box key={label} sx={{ p: 2.5, bgcolor: "#f5f0e5", border: "1px solid #e2dac9", borderRadius: 2 }}><Typography sx={{ color: "#607159", fontSize: 14 }}>{icon} {label}</Typography><Typography sx={{ fontSize: 23, fontWeight: 700, color: "#a8874b", mt: .5 }}>{value}</Typography></Box>)}
        </Box>
        {tab === "profile" ? <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.1fr .9fr" }, gap: 3 }}><Box sx={{ p: { xs: 2.5, md: 3 }, border: "1px solid #e2dac9", borderRadius: 2 }}><Stack direction="row" justifyContent="space-between" alignItems="center"><Typography sx={{ fontSize: 23, fontWeight: 700 }}>ข้อมูลสมาชิก</Typography>{editing ? <Stack direction="row" spacing={.5}><Button onClick={() => { setForm(customer); setEditing(false); }} color="inherit">ยกเลิก</Button><Button onClick={saveProfile} variant="contained" disableElevation>บันทึก</Button></Stack> : <Button onClick={() => setEditing(true)}>แก้ไขข้อมูล</Button>}</Stack>{editing ? <Stack spacing={1.7} sx={{ mt: 2.5 }}><TextField label="ชื่อสำหรับจัดส่ง" value={form?.name || ""} onChange={updateField("name")} fullWidth /><TextField label="อีเมล" type="email" value={form?.email || ""} onChange={updateField("email")} fullWidth /><TextField label="เบอร์โทรศัพท์" value={form?.phone || ""} onChange={updateField("phone")} fullWidth /><TextField label="ที่อยู่จัดส่ง" value={form?.address || ""} onChange={updateField("address")} multiline minRows={2} fullWidth /><TextField label="ความสนใจ" value={form?.note || ""} onChange={updateField("note")} fullWidth /></Stack> : <><Typography sx={{ fontSize: 20, fontWeight: 700, mt: 2 }}>{customer?.name}</Typography><Divider sx={{ my: 1.5 }} /><Stack spacing={1.25}>{profileRows.map(([label, value]) => <Stack key={label} direction={{ xs: "column", sm: "row" }} gap={{ xs: .2, sm: 2 }}><Typography sx={{ color: "#79856a", width: { sm: 130 }, fontSize: 15 }}>{label}</Typography><Typography sx={{ color: "#2c4031", fontWeight: 600 }}>{value}</Typography></Stack>)}</Stack></>}</Box><Box sx={{ p: { xs: 2.5, md: 3 }, bgcolor: "#183b2a", color: "#fffdf9", borderRadius: 2 }}><Typography sx={{ color: "#d6dfac", fontSize: 13, fontWeight: 700, letterSpacing: ".12em" }}>MEMBER BENEFITS</Typography><Typography sx={{ fontSize: 25, fontWeight: 700, mt: 1 }}>สิทธิพิเศษของคุณ</Typography><Stack spacing={1.3} sx={{ mt: 2.5 }}><Typography>✓ รับแต้มทุกการสั่งซื้อ</Typography><Typography>✓ รับข้อเสนอสำหรับเมนูโปรด</Typography><Typography>✓ บันทึกที่อยู่เพื่อชำระเงินเร็วขึ้น</Typography></Stack><Button onClick={onLogout} variant="outlined" sx={{ color: "#fffdf9", borderColor: "#d6dfac", mt: 3 }}>ออกจากระบบ</Button></Box></Box> : <Stack spacing={1.5}>{orders.length ? orders.map((order) => <Box key={order.id} sx={{ p: 2.5, border: "1px solid #e2dac9", borderRadius: 2 }}><Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={1}><Box><Typography sx={{ fontWeight: 700 }}>คำสั่งซื้อ #{order.id}</Typography><Typography sx={{ color: "#607159", fontSize: 15 }}>{order.createdAt} · {order.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}</Typography></Box><Box sx={{ textAlign: { sm: "right" } }}><Chip label="ยืนยันคำสั่งซื้อแล้ว" size="small" sx={{ bgcolor: "#e5eedc", color: "#547d3b" }} /><Typography sx={{ fontSize: 19, fontWeight: 700, color: "#a8874b", mt: .5 }}>{money(order.total)}</Typography></Box></Stack></Box>) : <Box sx={{ py: 6, textAlign: "center", color: "#607159", border: "1px dashed #cfc5b2", borderRadius: 2 }}>ยังไม่มีประวัติการสั่งซื้อ</Box>}</Stack>}
      </Box>
    </Box>
  </Box>;
}
