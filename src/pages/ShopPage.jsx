import { Box, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function ShopPage({ products, onAdd, onOpenProduct }) {
  const [query, setQuery] = useState("");
  const visibleProducts = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return keyword
      ? products.filter((product) =>
          JSON.stringify(product).toLowerCase().includes(keyword)
        )
      : products;
  }, [products, query]);

  return (
    <Box
      component="main"
      sx={{
        minHeight: "75vh",
        bgcolor: "#ece7db",
        px: { xs: 2.5, md: "8vw" },
        py: { xs: 5, md: 8 },
      }}
    >
      <Typography
        sx={{ color: "#6c815e", letterSpacing: ".18em", fontWeight: 700 }}
      >
        MATCHA MORI SHOP
      </Typography>
      <Typography
        component="h1"
        sx={{ fontSize: { xs: 38, md: 54 }, fontWeight: 700, mt: 1 }}
      >
        สั่งซื้อสินค้า
      </Typography>
      <Typography sx={{ color: "#586758", fontSize: 18, mt: 1, mb: 3 }}>
        เลือกมัทฉะแท้จากญี่ปุ่น แล้วเพิ่มสินค้าที่ต้องการลงตะกร้าได้ทันที
      </Typography>
      <TextField
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        label="ค้นหาสินค้า"
        placeholder="เช่น Ceremonial, ลาเต้ หรือทำขนม"
        sx={{ width: { xs: "100%", sm: 420 }, bgcolor: "#fffdf8" }}
      />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2,1fr)",
            lg: "repeat(3,1fr)",
          },
          gap: 2.5,
          mt: 4,
        }}
      >
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id || product.name}
            product={product}
            onView={onOpenProduct}
            onAdd={onAdd}
          />
        ))}
      </Box>
    </Box>
  );
}
