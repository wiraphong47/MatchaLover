import { Box, Stack, Typography } from "@mui/material";
const reviews = [
  {
    name: "พิมพ์ชนก · กรุงเทพฯ",
    text: "Ceremonial Grade หอมมาก สีเขียวสวย ชงเพียว ๆ แล้วนุ่มจริงค่ะ",
    product: "Ceremonial Grade",
  },
  {
    name: "ณัฐวุฒิ · เชียงใหม่",
    text: "Premium Blend ทำลาเต้ทุกเช้า รสชัดแต่ไม่ขม แพ็กของมาดีมาก",
    product: "Premium Blend",
  },
  {
    name: "อารยา · นนทบุรี",
    text: "ชอบชุด Home Tea Ritual มาก มีอุปกรณ์ครบ เหมาะให้เป็นของขวัญ",
    product: "Home Tea Ritual Set",
  },
];
export default function Reviews() {
  return (
    <Box
      component="section"
      sx={{
        bgcolor: "#fffdf9",
        px: { xs: 2.5, md: "8vw" },
        py: { xs: 7, md: 10 },
      }}
    >
      <Typography
        sx={{
          color: "#6c815e",
          fontSize: 13,
          letterSpacing: ".18em",
          fontWeight: 700,
        }}
      >
        CUSTOMER NOTES
      </Typography>
      <Typography variant="h2" sx={{ fontSize: { xs: 38, md: 50 }, mt: 1 }}>
        เสียงจากคนรักมัทฉะ
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
        <Typography sx={{ color: "#a8874b", fontSize: 22 }}>★★★★★</Typography>
        <Typography sx={{ color: "#607159" }}>4.9 จากรีวิวลูกค้า</Typography>
      </Stack>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" },
          gap: 2.5,
          mt: 4,
        }}
      >
        {reviews.map((review) => (
          <Box
            key={review.name}
            sx={{ p: 3, bgcolor: "#f5f0e5", borderTop: "3px solid #a8874b" }}
          >
            <Typography sx={{ color: "#a8874b", letterSpacing: ".12em" }}>
              ★★★★★
            </Typography>
            <Typography sx={{ mt: 1.4, fontSize: 18, lineHeight: 1.8 }}>
              “{review.text}”
            </Typography>
            <Typography sx={{ mt: 2.5, fontWeight: 700 }}>
              {review.name}
            </Typography>
            <Typography sx={{ color: "#607159", fontSize: 14 }}>
              {review.product}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
