import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
export default function NewsletterSignup({
  form,
  busy,
  message,
  change,
  submit,
  configured,
}) {
  return (
    <Box
      component="section"
      sx={{
        bgcolor: "#f3eddf",
        px: { xs: 2, md: "8vw" },
        py: { xs: 5, md: 7 },
      }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          bgcolor: "#112f22",
          color: "#fffdf6",
          borderRadius: { xs: 4, md: 6 },
          px: { xs: 3, md: 5 },
          py: { xs: 4, md: 5 },
          boxShadow: "0 22px 55px rgba(24,59,42,.18)",
          "&::after": {
            content: '""',
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            right: -90,
            top: -140,
            bgcolor: "rgba(183,202,132,.11)",
          },
        }}
      >
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={{ xs: 3, lg: 6 }}
        >
          <Box sx={{ flex: "0 0 36%", position: "relative", zIndex: 1 }}>
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.7,
                mb: 2,
                border: "1px solid rgba(239,226,189,.35)",
                borderRadius: 99,
                color: "#dce8b8",
              }}
            >
              <EmailOutlinedIcon sx={{ fontSize: 17 }} />
              <Typography
                sx={{ fontSize: 12, fontWeight: 700, letterSpacing: ".12em" }}
              >
                MATCHA MORI LETTER
              </Typography>
            </Box>
            <Typography
              variant="h2"
              sx={{ fontSize: { xs: 31, md: 42 }, lineHeight: 1.15 }}
            >
              จดหมายถึง
              <br />
              คนรักมัทฉะ
            </Typography>
            <Typography
              sx={{ mt: 2, color: "rgba(255,253,246,.76)", lineHeight: 1.8 }}
            >
              รับสูตรชง เคล็ดลับ และมัทฉะที่คัดให้เหมาะกับเมนูโปรดของคุณ
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={submit}
            sx={{ flex: 1, position: "relative", zIndex: 1 }}
          >
            <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
              <TextField
                required
                type="email"
                label="กรอกอีเมลของคุณ"
                autoComplete="email"
                value={form.email}
                onChange={(e) => change("email", e.target.value)}
                inputProps={{ maxLength: 254 }}
                sx={{ ...fieldSx, flex: 1 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={busy || !configured}
                endIcon={<SendRoundedIcon />}
                sx={{
                  bgcolor: "#b8cf7e",
                  color: "#153523",
                  borderRadius: 3,
                  px: 3,
                  minHeight: 56,
                  whiteSpace: "nowrap",
                  fontWeight: 800,
                  "&:hover": { bgcolor: "#c9dc98" },
                }}
              >
                {busy ? "กำลังส่ง…" : "รับจดหมายจากเรา"}
              </Button>
            </Stack>
            <Box sx={{ display: "none" }} aria-hidden="true">
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={(e) => change("website", e.target.value)}
              />
            </Box>
            <FormControlLabel
              sx={{
                mt: 1.5,
                alignItems: "flex-start",
                color: "rgba(255,253,246,.72)",
                "& .MuiFormControlLabel-label": {
                  fontSize: 12,
                  lineHeight: 1.55,
                  pt: 0.7,
                },
              }}
              control={
                <Checkbox
                  required
                  checked={form.consent}
                  onChange={(e) => change("consent", e.target.checked)}
                  sx={{
                    color: "#a9bd78",
                    "&.Mui-checked": { color: "#dce8b8" },
                  }}
                />
              }
              label="ฉันยินยอมให้เก็บอีเมลเพื่อส่งข่าวสารและคำแนะนำสินค้า โดยยกเลิกได้จากลิงก์ในอีเมล"
            />
            {!configured && (
              <Typography sx={{ mt: 1, color: "text.secondary" }}>
                ระบบรับข่าวสารกำลังเตรียมเปิดให้บริการ
              </Typography>
            )}
            {message && (
              <Alert
                sx={{ mt: 2, borderRadius: 3 }}
                severity={message.severity}
              >
                {message.text}
              </Alert>
            )}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}

const fieldSx = {
  flex: 1,
  "& .MuiInputLabel-root": { color: "rgba(255,253,246,.65)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "#dce8b8" },
  "& .MuiOutlinedInput-root": {
    color: "#fffdf6",
    bgcolor: "rgba(255,255,255,.07)",
    borderRadius: 3,
    "& fieldset": { borderColor: "rgba(255,255,255,.2)" },
    "&:hover fieldset": { borderColor: "rgba(220,232,184,.55)" },
    "&.Mui-focused fieldset": { borderColor: "#b8cf7e" },
  },
  "& .MuiSvgIcon-root": { color: "#dce8b8" },
};
