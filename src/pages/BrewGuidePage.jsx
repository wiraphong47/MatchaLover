import { Box, Typography } from "@mui/material";

const steps = [
  ["01", "ร่อนมัทฉะ", "ร่อนผงมัทฉะ 1–2 ช้อนชา เพื่อลดการจับตัวเป็นก้อน"],
  [
    "02",
    "เติมน้ำอุ่น",
    "ใช้น้ำอุณหภูมิ 70–80°C ประมาณ 60 มล. เพื่อรักษารสและกลิ่น",
  ],
  [
    "03",
    "ตีเป็นรูปตัว W",
    "ใช้แปรง Chasen ตีเร็ว ๆ เป็นรูปตัว W จนเกิดฟองละเอียด",
  ],
  ["04", "เสิร์ฟตามชอบ", "ดื่มแบบเพียว หรือเติมนมและน้ำแข็งเพื่อทำมัทฉะลาเต้"],
];

export default function BrewGuidePage() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "75vh",
        bgcolor: "#f4f0e5",
        px: { xs: 2.5, md: "10vw" },
        py: { xs: 5, md: 9 },
      }}
    >
      <Typography
        sx={{ color: "#789052", letterSpacing: ".18em", fontWeight: 700 }}
      >
        MATCHA BREW GUIDE
      </Typography>
      <Typography
        component="h1"
        sx={{ fontSize: { xs: 38, md: 56 }, fontWeight: 700, mt: 1 }}
      >
        วิธีชงมัทฉะให้อร่อย
      </Typography>
      <Typography sx={{ color: "#586758", fontSize: 18, mt: 1, maxWidth: 720 }}>
        เริ่มต้นง่าย ๆ ด้วยอุปกรณ์ไม่กี่ชิ้น เพื่อให้ได้มัทฉะเนียน หอม
        และมีฟองละเอียด
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2,1fr)" },
          gap: 2,
          mt: 5,
        }}
      >
        {steps.map(([number, title, detail]) => (
          <Box
            key={number}
            sx={{
              bgcolor: "#fffdf8",
              border: "1px solid #d9dfc9",
              borderRadius: 3,
              p: { xs: 3, md: 4 },
            }}
          >
            <Typography
              sx={{ color: "#91a36b", fontSize: 15, fontWeight: 800 }}
            >
              {number}
            </Typography>
            <Typography
              component="h2"
              sx={{ color: "#173b2a", fontSize: 28, fontWeight: 700, mt: 0.5 }}
            >
              {title}
            </Typography>
            <Typography
              sx={{ color: "#617060", fontSize: 17, lineHeight: 1.8, mt: 1 }}
            >
              {detail}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
