import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function CustomerDialog({ open, onClose, customer, onSave }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    note: "",
  });
  useEffect(() => {
    if (open)
      setForm(
        customer || { name: "", email: "", phone: "", address: "", note: "" },
      );
  }, [open, customer]);
  const change = (key) => (event) =>
    setForm({ ...form, [key]: event.target.value });
  const submit = (event) => {
    event.preventDefault();
    if (form.name && form.email && form.phone) {
      onSave(form);
      onClose();
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ component: "form", onSubmit: submit }}
    >
      <DialogTitle
        sx={{ fontFamily: "Pridi, serif", fontSize: 30, color: "#183b2a" }}
      >
        {customer ? "ข้อมูลบัญชีของฉัน" : "สมัครสมาชิก Matcha Mori"}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: "#607159", mb: 2.5 }}>
          บันทึกข้อมูลเพื่อสั่งซื้อสะดวก ดูประวัติคำสั่งซื้อ
          และรับคำแนะนำที่เหมาะกับคุณ
        </Typography>
        <Stack spacing={2}>
          <TextField
            required
            label="ชื่อสำหรับจัดส่ง"
            value={form.name}
            onChange={change("name")}
          />
          <TextField
            required
            type="email"
            label="อีเมล"
            value={form.email}
            onChange={change("email")}
          />
          <TextField
            required
            label="เบอร์โทรศัพท์"
            value={form.phone}
            onChange={change("phone")}
          />
          <TextField
            multiline
            minRows={2}
            label="ที่อยู่จัดส่ง"
            value={form.address}
            onChange={change("address")}
          />
          <TextField
            label="ความสนใจ (เช่น ลาเต้ / ชงดื่ม / ทำขนม)"
            value={form.note}
            onChange={change("note")}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">
          ยกเลิก
        </Button>
        <Button type="submit" variant="contained" disableElevation>
          บันทึกข้อมูล
        </Button>
      </DialogActions>
    </Dialog>
  );
}
