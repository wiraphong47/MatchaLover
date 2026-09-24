import { Box, Typography } from "@mui/material";
import PersonalizedRecommendations from "../components/PersonalizedRecommendations";
import useRecommendations from "../hooks/useRecommendations";

export default function MatchaFinderPage({
  products,
  customer,
  onSavePreferences,
  onAdd,
  onOpenProduct,
}) {
  const recommendation = useRecommendations(
    products,
    customer,
    onSavePreferences
  );

  return (
    <Box
      component="main"
      sx={{
        minHeight: "75vh",
        bgcolor: "#ece7db",
        px: { xs: 2, md: "7vw" },
        py: { xs: 4, md: 7 },
      }}
    >
      <Box sx={{ maxWidth: 1400, mx: "auto" }}>
        <Typography
          sx={{ color: "#6c815e", letterSpacing: ".18em", fontWeight: 700 }}
        >
          FIND YOUR MATCHA
        </Typography>
        <Typography
          component="h1"
          sx={{ fontSize: { xs: 36, md: 52 }, fontWeight: 700, mt: 1 }}
        >
          ค้นหามัทฉะที่ใช่สำหรับคุณ
        </Typography>
        <Typography sx={{ color: "#586758", fontSize: 18, mt: 1 }}>
          เลือกวิธีดื่ม รสชาติ และกลิ่นที่ชอบ แล้วระบบจะเรียงมัทฉะที่เหมาะกับคุณ
        </Typography>
        <PersonalizedRecommendations
          {...recommendation}
          onAdd={onAdd}
          onView={onOpenProduct}
        />
      </Box>
    </Box>
  );
}
