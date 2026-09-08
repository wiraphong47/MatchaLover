import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function CustomerDialog({ open, onClose, customer, onSave }) {
  const needsCredentials = !customer?.username || !customer?.password;
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    address: "",
    note: "",
  });
  useEffect(() => {
    if (open)
      setForm(
        customer || {
          name: "",
          username: "",
          password: "",
          email: "",
          phone: "",
          address: "",
          note: "",
          consent: false,
        }
      );
  }, [open, customer]);
  const change = (key) => (event) =>
    setForm({ ...form, [key]: event.target.value });
  const submit = (event) => {
    event.preventDefault();
    if (
      form.name &&
      form.email &&
      form.phone &&
      (!needsCredentials || (form.username && form.password && form.consent))
    ) {
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
        {needsCredentials ? "สมัครสมาชิก Matcha Mori" : "ข้อมูลบัญชีของฉัน"}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: "#607159", mb: 2.5 }}>
          บันทึกข้อมูลเพื่อสั่งซื้อสะดวก ดูประวัติคำสั่งซื้อ
          และรับคำแนะนำที่เหมาะกับคุณ
        </Typography>
        <Stack spacing={2}>
          {needsCredentials && (
            <TextField
              required
              label="ชื่อผู้ใช้สำหรับเข้าสู่ระบบ"
              value={form.username}
              onChange={change("username")}
            />
          )}
          {needsCredentials && (
            <TextField
              required
              type="password"
              label="รหัสผ่าน"
              value={form.password}
              onChange={change("password")}
              helperText="ใช้สำหรับเข้าสู่ระบบในครั้งถัดไป"
            />
          )}
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
          {needsCredentials && (
            <FormControlLabel
              required
              control={
                <Checkbox
                  checked={Boolean(form.consent)}
                  onChange={(event) =>
                    setForm({ ...form, consent: event.target.checked })
                  }
                />
              }
              label="ฉันยินยอมให้ Matcha Mori เก็บข้อมูลเพื่อจัดการสมาชิกและคำสั่งซื้อ"
            />
          )}
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
