import { Box, Typography } from "@mui/material";
import PackageCollection from "../components/PackageCollection";

export default function PackagesPage({ packages, products, onAdd }) {
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
          MATCHA SETS
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: 38, md: 52 }, mt: 1 }}>
          แพ็กเกจที่คัดมาให้
        </Typography>
      </Box>
      <PackageCollection
        packages={packages}
        products={products}
        onAdd={onAdd}
      />
    </Box>
  );
}
