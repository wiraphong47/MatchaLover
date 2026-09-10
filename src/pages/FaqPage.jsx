import { Box, Typography } from "@mui/material";
import Faq from "../components/Faq";

export default function FaqPage() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "70vh",
        px: { xs: 2.5, md: "8vw" },
        py: { xs: 6, md: 9 },
      }}
    >
      <Typography
        sx={{
          color: "#6c815e",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: ".18em",
        }}
      >
        HELP CENTER
      </Typography>
      <Typography variant="h1" sx={{ fontSize: { xs: 37, md: 52 }, mt: 1 }}>
        คำถามที่พบบ่อย
      </Typography>
      <Faq />
    </Box>
  );
}
