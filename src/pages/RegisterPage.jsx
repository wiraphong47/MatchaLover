import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SpaOutlinedIcon from "@mui/icons-material/SpaOutlined";
import useCustomerForm from "../hooks/useCustomerForm";
import { interestGroups } from "../utils/matchaInterests";

const benefits = [
  [LocalShippingOutlinedIcon, "สั่งซื้อได้สะดวก", "บันทึกที่อยู่สำหรับครั้งถัดไป"],
  [HistoryRoundedIcon, "ดูประวัติคำสั่งซื้อ", "ติดตามรายการย้อนหลังได้ในที่เดียว"],
  [AutoAwesomeRoundedIcon, "คัดมัทฉะให้เหมาะกับคุณ", "แนะนำจากรสชาติและเมนูที่ชอบ"],
];

export default function RegisterPage({ onSave, onBack }) {
  const {
    form,
    change,
    setConsent,
    toggleInterest,
    selectedInterests,
    submit,
    busy,
    error,
  } = useCustomerForm({ open: true, customer: null, onSave, onClose: onBack });

  return (
    <Box
      component="main"
      sx={{ bgcolor: "#eee9de", px: { xs: 0, sm: 2 }, py: { xs: 0, sm: 3 } }}
    >
      <Box
        component="form"
        onSubmit={submit}
        noValidate
        sx={{
          width: "min(1100px, 100%)",
          minHeight: { xs: "calc(100vh - 110px)", md: 760 },
          mx: "auto",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "340px minmax(0, 1fr)" },
          bgcolor: "#fffdf8",
          borderRadius: { xs: 0, sm: 4 },
          overflow: "hidden",
          boxShadow: { sm: "0 20px 60px rgba(35,48,35,.14)" },
        }}
      >
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            bgcolor: "#173b2a",
            color: "#fffdf5",
            p: { xs: 3, md: 4.5 },
            "&::after": {
              content: '\"\"',
              position: "absolute",
              width: 280,
              height: 280,
              borderRadius: "50%",
              bgcolor: "rgba(196,215,145,.12)",
              right: -150,
              bottom: -120,
            },
          }}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <SpaOutlinedIcon sx={{ color: "#cbdc9e" }} />
            <Typography sx={{ fontFamily: "Pridi, serif", fontSize: 25, fontWeight: 600 }}>
              Matcha Mori
            </Typography>
          </Stack>
          <Typography
            component="h1"
            sx={{
              fontFamily: "Pridi, serif",
              fontSize: { xs: 34, md: 42 },
              lineHeight: 1.2,
              mt: { xs: 3, md: 5 },
            }}
          >
            มาเริ่มต้น
            <br />
            เรื่องราวมัทฉะ
            <br />
            ของคุณกัน
          </Typography>
          <Typography sx={{ mt: 2, color: "rgba(255,253,245,.72)", lineHeight: 1.75 }}>
            สมัครครั้งเดียว แล้วให้ทุกแก้วต่อจากนี้เป็นมัทฉะที่เข้าใจคุณมากขึ้น
          </Typography>
          <Stack spacing={2.3} sx={{ mt: 4, position: "relative", zIndex: 1 }}>
            {benefits.map(([Icon, title, detail]) => (
              <Stack key={title} direction="row" spacing={1.5}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    flex: "0 0 auto",
                    borderRadius: "50%",
                    bgcolor: "rgba(203,220,158,.14)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon sx={{ color: "#cbdc9e", fontSize: 21 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
                  <Typography sx={{ color: "rgba(255,253,245,.62)", fontSize: 12.5 }}>
                    {detail}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Box sx={{ minWidth: 0, p: { xs: 2.5, sm: 4 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography
                component="h2"
                sx={{ fontFamily: "Pridi, serif", color: "#173b2a", fontSize: 34, fontWeight: 600 }}
              >
                สมัครสมาชิก
              </Typography>
              <Typography sx={{ color: "#667464", mt: 0.5 }}>
                กรอกข้อมูลเพื่อสร้างบัญชี Matcha Mori
              </Typography>
            </Box>
            <IconButton type="button" onClick={onBack} disabled={busy} aria-label="ปิด">
              <CloseRoundedIcon />
            </IconButton>
          </Stack>

          <Section number="01" title="ข้อมูลบัญชี">
            <Box sx={formGridSx}>
              <TextField required type="email" label="อีเมล" autoComplete="email" value={form.email} onChange={change("email")} />
              <TextField required type="password" label="รหัสผ่าน" autoComplete="new-password" value={form.password} onChange={change("password")} inputProps={{ minLength: 8 }} helperText="อย่างน้อย 8 ตัวอักษร" />
            </Box>
          </Section>

          <Section number="02" title="ข้อมูลสำหรับจัดส่ง">
            <Box sx={formGridSx}>
              <TextField required label="ชื่อผู้รับ" value={form.name} onChange={change("name")} />
              <TextField required label="เบอร์โทรศัพท์" autoComplete="tel" value={form.phone} onChange={change("phone")} />
              <TextField multiline minRows={2} label="ที่อยู่จัดส่ง" autoComplete="street-address" value={form.address} onChange={change("address")} sx={{ gridColumn: "1 / -1" }} />
            </Box>
          </Section>

          <Section number="03" title="มัทฉะที่คุณชอบ" optional>
            <Typography sx={{ fontSize: 13.5, color: "#667464", mb: 1.5 }}>
              เลือกได้หลายข้อ เพื่อให้เราแนะนำมัทฉะได้ตรงใจกว่าเดิม
            </Typography>
            <Stack spacing={2}>
              {interestGroups.map((group) => (
                <Box key={group.title} component="fieldset" sx={{ border: 0, p: 0, m: 0 }}>
                  <Typography component="legend" sx={{ color: "#385642", fontSize: 13, fontWeight: 800, mb: 1 }}>
                    {group.title}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {group.options.map((item) => {
                      const checked = selectedInterests.includes(item.key);
                      return (
                        <Button
                          key={item.key}
                          type="button"
                          size="small"
                          onClick={() => toggleInterest(item.key)}
                          disabled={busy}
                          variant={checked ? "contained" : "outlined"}
                          sx={{ borderRadius: 99 }}
                        >
                          {checked ? "✓ " : ""}{item.label}
                        </Button>
                      );
                    })}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Section>

          <FormControlLabel
            required
            sx={{ mt: 3 }}
            control={<Checkbox checked={Boolean(form.consent)} onChange={(event) => setConsent(event.target.checked)} />}
            label={<Typography sx={{ fontSize: 13.5, color: "#526151" }}>ฉันยินยอมให้ Matcha Mori เก็บข้อมูลเพื่อจัดการสมาชิกและคำสั่งซื้อ</Typography>}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Stack direction="row" justifyContent="flex-end" spacing={1.2} sx={{ mt: 3 }}>
            <Button type="button" color="inherit" onClick={onBack} disabled={busy}>ยกเลิก</Button>
            <Button type="submit" variant="contained" disabled={busy} sx={{ borderRadius: 99, px: 4, bgcolor: "#315d3f" }}>
              {busy ? "กำลังสมัคร…" : "สมัครสมาชิก"}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

function Section({ number, title, optional = false, children }) {
  return (
    <Box component="section" sx={{ mt: 3.5 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
        <Typography sx={{ color: "#8da067", fontWeight: 800, fontSize: 12 }}>{number}</Typography>
        <Typography sx={{ color: "#173b2a", fontWeight: 800 }}>{title}</Typography>
        {optional && <Typography sx={{ ml: "auto !important", color: "#8a9587", fontSize: 12 }}>ไม่บังคับ</Typography>}
      </Stack>
      {children}
    </Box>
  );
}

const formGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
  gap: 1.5,
  "& .MuiOutlinedInput-root": { borderRadius: 2.5, bgcolor: "#fff" },
};
