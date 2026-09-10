import { Box, Typography } from "@mui/material";

export default function StoryPage() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "70vh",
        maxWidth: 850,
        mx: "auto",
        px: { xs: 2.5, md: 4 },
        py: { xs: 6, md: 10 },
      }}
    >
      <Typography
        sx={{
          color: "#a8874b",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: ".18em",
        }}
      >
        OUR STORY
      </Typography>
      <Typography variant="h1" sx={{ fontSize: { xs: 40, md: 56 }, mt: 1 }}>
        เรื่องราวของ Matcha Mori
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: 17, md: 19 },
          lineHeight: 2,
          color: "#536154",
          mt: 3,
        }}
      >
        เราเชื่อว่ามัทฉะที่ดีเริ่มต้นจากการเคารพธรรมชาติ
        คัดสรรใบชาจากแหล่งปลูกชั้นดีในญี่ปุ่น และบดด้วยหินอย่างละเมียดละไม
        เพื่อส่งต่อช่วงเวลาสงบในทุกถ้วยของคุณ
      </Typography>
    </Box>
  );
}
