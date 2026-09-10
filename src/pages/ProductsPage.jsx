import { Box, Button, Stack, Typography } from "@mui/material";
import CatalogControls from "../components/CatalogControls";
import ProductCard from "../components/ProductCard";
import RecommendationQuiz from "../components/RecommendationQuiz";

export default function ProductsPage({
  products,
  category,
  query,
  onCategoryChange,
  onQueryChange,
  onAdd,
  onOpenProduct,
  onNavigate,
}) {
  const matchesSearch = (item) =>
    JSON.stringify(item).toLowerCase().includes(query.trim().toLowerCase());
  const visibleProducts = products.filter(matchesSearch);
  return (
    <Box
      component="main"
      sx={{
        bgcolor: "#ece7db",
        minHeight: "70vh",
        px: { xs: 2.5, md: "8vw" },
        py: { xs: 5, md: 8 },
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
        OUR COLLECTION
      </Typography>
      <Typography
        variant="h1"
        sx={{ fontSize: { xs: 38, md: 52 }, mt: 1, mb: 4 }}
      >
        เลือกมัทฉะที่ใช่สำหรับคุณ
      </Typography>
      <CatalogControls
        category={category}
        onCategoryChange={onCategoryChange}
        query={query}
        onQueryChange={onQueryChange}
      />
      {(category === "all" || category === "matcha") && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" },
            gap: 2.5,
            mt: 4,
          }}
        >
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.name}
              product={product}
              onView={onOpenProduct}
              onAdd={onAdd}
            />
          ))}
        </Box>
      )}
      {!query.trim() && (category === "all" || category === "matcha") && (
        <RecommendationQuiz
          products={products}
          onAdd={onAdd}
          onView={onOpenProduct}
        />
      )}
      <Stack direction={{ xs: "column", sm: "row" }} gap={1.5} sx={{ mt: 5 }}>
        <Button variant="outlined" onClick={() => onNavigate("packages")}>
          ดูแพ็กเกจ
        </Button>
        <Button variant="outlined" onClick={() => onNavigate("tools")}>
          ดูอุปกรณ์ชง
        </Button>
        <Button variant="outlined" onClick={() => onNavigate("grades")}>
          ความต่างแต่ละเกรด
        </Button>
      </Stack>
    </Box>
  );
}
