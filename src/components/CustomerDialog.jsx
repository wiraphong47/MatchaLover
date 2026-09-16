import {
  Box,
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
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
  [
    LocalShippingOutlinedIcon,
    "สั่งซื้อได้สะดวก",
    "บันทึกที่อยู่สำหรับครั้งถัดไป",
  ],
  [
    HistoryRoundedIcon,
    "ดูประวัติคำสั่งซื้อ",
    "ติดตามรายการย้อนหลังได้ในที่เดียว",
  ],
  [
    AutoAwesomeRoundedIcon,
    "คัดมัทฉะให้เหมาะกับคุณ",
    "แนะนำจากรสชาติและเมนูที่ชอบ",
  ],
];

export default function CustomerDialog({ open, onClose, customer, onSave }) {
  const {
    form,
    change,
    setConsent,
    toggleInterest,
    selectedInterests,
    submit,
    busy,
    error,
    clearError,
    needsCredentials,
  } = useCustomerForm({ open, customer, onSave, onClose });

  return (
    <Dialog
      open={open}
      onClose={busy ? undefined : onClose}
      TransitionProps={{ onExited: clearError }}
      fullWidth
      maxWidth="md"
      PaperProps={{
        component: "form",
        onSubmit: submit,
        noValidate: true,
        sx: {
          borderRadius: { xs: 0, sm: 4 },
          overflow: "hidden",
          bgcolor: "#fffdf8",
          height: { xs: "100%", sm: "min(820px, 92vh)" },
          maxHeight: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "300px 1fr" },
          height: "100%",
          minHeight: 0,
        }}
      >
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            bgcolor: "#173b2a",
            color: "#fffdf5",
            p: { xs: 3, md: 4 },
            display: { xs: needsCredentials ? "block" : "none", md: "block" },
            "&::after": {
              content: '""',
              position: "absolute",
              width: 240,
              height: 240,
              borderRadius: "50%",
              bgcolor: "rgba(196,215,145,.12)",
              right: -120,
              bottom: -100,
            },
          }}
        >
          <Stack direction="row" spacing={1.2} alignItems="center">
            <SpaOutlinedIcon sx={{ color: "#cbdc9e" }} />
            <Typography sx={{ fontFamily: "Pridi, serif", fontSize: 24 }}>
              Matcha Mori
            </Typography>
          </Stack>
          <Typography
            component="h2"
            sx={{
              fontFamily: "Pridi, serif",
              fontSize: { xs: 30, md: 38 },
              lineHeight: 1.2,
              mt: 4,
            }}
          >
            มาเริ่มต้น
            <br />
            เรื่องราวมัทฉะ
            <br />
            ของคุณกัน
          </Typography>
          <Typography
            sx={{ mt: 2, color: "rgba(255,253,245,.72)", lineHeight: 1.75 }}
          >
            สมัครครั้งเดียว แล้วให้ทุกแก้วต่อจากนี้เป็นมัทฉะที่เข้าใจคุณมากขึ้น
          </Typography>
          <Stack spacing={2.3} sx={{ mt: 4, position: "relative", zIndex: 1 }}>
            {benefits.map(([Icon, title, detail]) => (
              <Stack key={title} direction="row" spacing={1.5}>
                <Box
                  sx={{
                    width: 38,
                    height: 38,
                    flex: "0 0 auto",
                    borderRadius: "50%",
                    bgcolor: "rgba(203,220,158,.14)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon sx={{ color: "#cbdc9e", fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
                  <Typography
                    sx={{
                      color: "rgba(255,253,245,.62)",
                      fontSize: 12.5,
                      lineHeight: 1.5,
                    }}
                  >
                    {detail}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Box
          sx={{
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: { xs: 2.5, sm: 4 },
              pt: { xs: 2.5, sm: 3.5 },
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box>
              <Typography
                component="h1"
                sx={{
                  fontFamily: "Pridi, serif",
                  color: "#173b2a",
                  fontSize: { xs: 26, sm: 32 },
                  fontWeight: 600,
                }}
              >
                {needsCredentials ? "สมัครสมาชิก" : "ข้อมูลบัญชีของฉัน"}
              </Typography>
              <Typography sx={{ color: "#667464", fontSize: 14, mt: 0.5 }}>
                {needsCredentials
                  ? "กรอกข้อมูลเพื่อสร้างบัญชี Matcha Mori"
                  : "แก้ไขข้อมูลสำหรับบัญชีและการจัดส่ง"}
              </Typography>
            </Box>
            <IconButton onClick={onClose} disabled={busy} aria-label="ปิด">
              <CloseRoundedIcon />
            </IconButton>
          </Box>

          <DialogContent
            sx={{
              px: { xs: 2.5, sm: 4 },
              py: 3,
              flex: "1 1 auto",
              minHeight: 0,
              overflowY: "auto",
              scrollbarGutter: "stable",
            }}
          >
            <Stack spacing={3}>
              <Section title="ข้อมูลบัญชี" number="01">
                <Box sx={formGridSx}>
                  <TextField
                    required
                    type="email"
                    label="อีเมล"
                    autoComplete="email"
                    value={form.email}
                    onChange={change("email")}
                  />
                  {needsCredentials && (
                    <TextField
                      required
                      type="password"
                      label="รหัสผ่าน"
                      value={form.password}
                      onChange={change("password")}
                      autoComplete="new-password"
                      inputProps={{ minLength: 8 }}
                      helperText="อย่างน้อย 8 ตัวอักษร"
                    />
                  )}
                </Box>
              </Section>

              <Section title="ข้อมูลสำหรับจัดส่ง" number="02">
                <Box sx={formGridSx}>
                  <TextField
                    required
                    label="ชื่อผู้รับ"
                    value={form.name}
                    onChange={change("name")}
                  />
                  <TextField
                    required
                    label="เบอร์โทรศัพท์"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={change("phone")}
                  />
                  <TextField
                    multiline
                    minRows={2}
                    label="ที่อยู่จัดส่ง"
                    autoComplete="street-address"
                    value={form.address}
                    onChange={change("address")}
                    sx={{ gridColumn: "1 / -1" }}
                  />
                </Box>
              </Section>

              <Section title="มัทฉะที่คุณชอบ" number="03" optional>
                <Typography sx={{ fontSize: 13.5, color: "#667464", mb: 1.5 }}>
                  เลือกได้หลายข้อ เพื่อให้เราแนะนำมัทฉะได้ตรงใจกว่าเดิม
                </Typography>
                <Stack spacing={2}>
                  {interestGroups.map((group) => (
                    <Box
                      key={group.title}
                      component="fieldset"
                      sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}
                    >
                      <Typography
                        component="legend"
                        sx={{
                          color: "#385642",
                          fontSize: 13,
                          fontWeight: 800,
                          mb: 1,
                        }}
                      >
                        {group.title}
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {group.options.map((item) => {
                          const checked = selectedInterests.includes(item.key);
                          return (
                            <Box
                              component="label"
                              key={item.key}
                              sx={{
                                px: 1.5,
                                py: 0.8,
                                borderRadius: 99,
                                border: "1px solid",
                                borderColor: checked ? "#58763f" : "#d8dece",
                                bgcolor: checked ? "#e8eed8" : "#fff",
                                color: "#294b35",
                                cursor: busy ? "default" : "pointer",
                                fontSize: 13.5,
                                fontWeight: checked ? 700 : 500,
                              }}
                            >
                              <Checkbox
                                checked={checked}
                                onChange={() => toggleInterest(item.key)}
                                disabled={busy}
                                size="small"
                                sx={{ display: "none" }}
                              />
                              {checked ? "✓ " : ""}
                              {item.label}
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Section>

              {needsCredentials && (
                <FormControlLabel
                  required
                  control={
                    <Checkbox
                      checked={Boolean(form.consent)}
                      onChange={(event) => setConsent(event.target.checked)}
                      sx={{
                        color: "#789052",
                        "&.Mui-checked": { color: "#58763f" },
                      }}
                    />
                  }
                  label={
                    <Typography sx={{ fontSize: 13.5, color: "#526151" }}>
                      ฉันยินยอมให้ Matcha Mori
                      เก็บข้อมูลเพื่อจัดการสมาชิกและคำสั่งซื้อ
                    </Typography>
                  }
                />
              )}
            </Stack>
          </DialogContent>

          {error && (
            <Alert
              severity="error"
              sx={{ mx: { xs: 2.5, sm: 4 }, mb: 1.5, flex: "0 0 auto" }}
            >
              {error}
            </Alert>
          )}

          <DialogActions
            sx={{
              flex: "0 0 auto",
              px: { xs: 2.5, sm: 4 },
              py: 2,
              borderTop: "1px solid #e4e8dc",
              bgcolor: "#fffdf8",
            }}
          >
            <Button onClick={onClose} color="inherit" disabled={busy}>
              ยกเลิก
            </Button>
            <Button
              type="submit"
              variant="contained"
              disableElevation
              disabled={busy}
              sx={{
                borderRadius: 99,
                px: 3.5,
                bgcolor: "#315d3f",
                "&:hover": { bgcolor: "#244b32" },
              }}
            >
              {busy
                ? "กำลังบันทึก…"
                : needsCredentials
                  ? "สมัครสมาชิก"
                  : "บันทึกการเปลี่ยนแปลง"}
            </Button>
          </DialogActions>
        </Box>
      </Box>
    </Dialog>
  );
}

function Section({ title, number, optional = false, children }) {
  return (
    <Box component="section">
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
        <Typography
          sx={{
            color: "#8da067",
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: ".08em",
          }}
        >
          {number}
        </Typography>
        <Typography sx={{ color: "#173b2a", fontWeight: 800 }}>
          {title}
        </Typography>
        {optional && (
          <Typography
            sx={{ ml: "auto !important", color: "#8a9587", fontSize: 12 }}
          >
            ไม่บังคับ
          </Typography>
        )}
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
