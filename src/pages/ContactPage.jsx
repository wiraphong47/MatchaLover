import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import { Box, Button, Typography } from "@mui/material";

export default function ContactPage({ onBackToLine }) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "75vh",
        bgcolor: "#ece7db",
        px: 2.5,
        py: { xs: 6, md: 10 },
      }}
    >
      <Box
        sx={{
          maxWidth: 760,
          mx: "auto",
          bgcolor: "#173b2a",
          color: "#fffdf8",
          borderRadius: 4,
          p: { xs: 3.5, md: 6 },
          textAlign: "center",
        }}
      >
        <ChatBubbleOutlineRoundedIcon sx={{ color: "#d8e5ad", fontSize: 64 }} />
        <Typography
          sx={{
            color: "#d8e5ad",
            letterSpacing: ".16em",
            fontWeight: 700,
            mt: 2,
          }}
        >
          CONTACT MATCHA MORI
        </Typography>
        <Typography
          component="h1"
          sx={{ fontSize: { xs: 36, md: 52 }, fontWeight: 700, mt: 1 }}
        >
          ติดต่อร้าน
        </Typography>
        <Typography
          sx={{ color: "#d9e1d7", fontSize: 18, lineHeight: 1.8, mt: 2 }}
        >
          สอบถามเรื่องสินค้า การเลือกมัทฉะ การชำระเงิน หรือคำสั่งซื้อได้ทางแชต
          LINE Official Account ที่คุณเปิด Rich Menu นี้
        </Typography>
        <Button
          onClick={onBackToLine}
          variant="contained"
          size="large"
          sx={{ mt: 4, bgcolor: "#d8e5ad", color: "#173b2a" }}
        >
          กลับไปส่งข้อความใน LINE
        </Button>
      </Box>
    </Box>
  );
}
