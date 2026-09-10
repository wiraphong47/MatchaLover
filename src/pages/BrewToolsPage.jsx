import { Box, Typography } from "@mui/material";
import BrewTools from "../components/BrewTools";

export default function BrewToolsPage({ tools, onAdd }) {
  return (
    <Box component="main" sx={{ minHeight: "70vh", pt: { xs: 4, md: 6 } }}>
      <Box sx={{ px: { xs: 2.5, md: "8vw" } }}>
        <Typography
          sx={{
            color: "#6c815e",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: ".18em",
          }}
        >
          BREWING TOOLS
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: 38, md: 52 }, mt: 1 }}>
          อุปกรณ์ชงมัทฉะ
        </Typography>
      </Box>
      <BrewTools tools={tools} onAdd={onAdd} />
    </Box>
  );
}
