import { Box, Typography } from "@mui/material";
import GradeGuide from "../components/GradeGuide";

export default function GradeGuidePage({ products }) {
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
        MATCHA GUIDE
      </Typography>
      <Typography variant="h1" sx={{ fontSize: { xs: 37, md: 52 }, mt: 1 }}>
        แต่ละเกรดแตกต่างกันอย่างไร?
      </Typography>
      <GradeGuide products={products} />
    </Box>
  );
}
