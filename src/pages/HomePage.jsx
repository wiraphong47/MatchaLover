import { Box, Button, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import BrewTools from "../components/BrewTools";
import CatalogControls from "../components/CatalogControls";
import Faq from "../components/Faq";
import GradeGuide from "../components/GradeGuide";
import Hero from "../components/Hero";
import PackageCollection from "../components/PackageCollection";
import ProductCard from "../components/ProductCard";
import RecommendationQuiz from "../components/PersonalizedRecommendations";
import NewsletterSignup from "../components/NewsletterSignup";
import useNewsletter from "../hooks/useNewsletter";
import useRecommendations from "../hooks/useRecommendations";
import Reviews from "../components/Reviews";
import TrustFeatures from "../components/TrustFeatures";

export default function HomePage({
  products,
  packages,
  tools,
  onAdd,
  onOpenProduct,
  onScrollTo,
  customer,
  onSavePreferences,
}) {
  const newsletter = useNewsletter();
  const recommendation = useRecommendations(
    products,
    customer,
    onSavePreferences
  );
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const matchesSearch = (item) =>
    JSON.stringify(item).toLowerCase().includes(query.trim().toLowerCase());
  const filteredProducts = useMemo(
    () => products.filter(matchesSearch),
    [products, query]
  );
  const filteredPackages = useMemo(
    () => packages.filter(matchesSearch),
    [packages, query]
  );
  const filteredTools = useMemo(
    () => tools.filter(matchesSearch),
    [tools, query]
  );
  const isSearching = Boolean(query.trim());

  return (
    <Box component="main">
      {/* ส่วน Hero: ข้อความหลักและปุ่มพาไปยังส่วนสินค้า */}
      <Hero onShopClick={() => onScrollTo("products")} />

      {/* ส่วนเรื่องราวของเรา: ปรัชญาและที่มาของแบรนด์ */}
      <Box
        component="section"
        id="story"
        sx={{
          maxWidth: 760,
          mx: "auto",
          px: 2.5,
          py: { xs: 5, md: 7 },
          textAlign: "center",
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
          THE MATCHA MORI PHILOSOPHY
        </Typography>
        <Typography variant="h2" sx={{ fontSize: { xs: 38, md: 52 }, mt: 2 }}>
          มัทฉะแท้{" "}
          <Box component="em" sx={{ color: "#547d3b", fontStyle: "normal" }}>
            คุณภาพพรีเมียม
          </Box>
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 17, md: 19 },
            lineHeight: 2,
            color: "#536154",
            mt: 2.5,
          }}
        >
          คัดสรรใบชาจากญี่ปุ่น บดอย่างพิถีพิถัน เพื่อรักษากลิ่นหอม รสอูมามิ
          และสีเขียวตามธรรมชาติไว้ในทุกคำ
        </Typography>
      </Box>
      <TrustFeatures />

      {/* ส่วนสินค้าของเรา: ค้นหา กรองสินค้า การ์ดมัทฉะ และคำแนะนำสินค้า */}
      <Box
        component="section"
        id="products"
        sx={{
          bgcolor: "#ece7db",
          px: { xs: 2.5, md: "8vw" },
          py: { xs: 6, md: 8 },
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
          variant="h2"
          sx={{ fontSize: { xs: 36, md: 50 }, mt: 1, mb: 4 }}
        >
          เลือกมัทฉะที่ใช่สำหรับคุณ
        </Typography>
        <CatalogControls
          category={category}
          onCategoryChange={setCategory}
          query={query}
          onQueryChange={setQuery}
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
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.name}
                product={product}
                onView={onOpenProduct}
                onAdd={onAdd}
              />
            ))}
          </Box>
        )}
        {!isSearching && (category === "all" || category === "matcha") && (
          <RecommendationQuiz
            {...recommendation}
            onAdd={onAdd}
            onView={onOpenProduct}
          />
        )}
        {!isSearching && (category === "all" || category === "matcha") && (
          <Box id="grades">
            <GradeGuide products={products} />
          </Box>
        )}
      </Box>

      {/* ส่วนแพ็กเกจและอุปกรณ์ชง */}
      {(category === "all" || category === "package") &&
        filteredPackages.length > 0 && (
          <Box id="packages">
            <PackageCollection
              packages={filteredPackages}
              products={products}
              onAdd={onAdd}
            />
          </Box>
        )}
      {(category === "all" || category === "tools") &&
        filteredTools.length > 0 && (
          <Box id="tools">
            <BrewTools tools={filteredTools} onAdd={onAdd} />
          </Box>
        )}
      {!isSearching && (
        <>
          <Reviews />
          <Box id="faq">
            <Faq />
          </Box>
        </>
      )}

      {/* ส่วนปิดท้ายหน้า: ชวนผู้ใช้กลับไปเลือกสินค้า */}
      <NewsletterSignup {...newsletter} />
      <Box
        component="section"
        sx={{
          bgcolor: "#183b2a",
          color: "#fffdf9",
          px: { xs: 3, md: "13vw" },
          py: { xs: 7, md: 10 },
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            color: "#d6dfac",
            fontSize: 13,
            letterSpacing: ".18em",
            fontWeight: 700,
          }}
        >
          A DAILY RITUAL
        </Typography>
        <Typography variant="h2" sx={{ fontSize: { xs: 36, md: 50 }, mt: 1.5 }}>
          ให้ทุกวันเริ่มต้นอย่าง{" "}
          <Box component="em" sx={{ color: "#f1e4c2", fontStyle: "normal" }}>
            ละเมียดละไม
          </Box>
        </Typography>
        <Button
          onClick={() => onScrollTo("products")}
          variant="contained"
          disableElevation
          sx={{ mt: 3, bgcolor: "#efe2bd", color: "#183b2a" }}
        >
          ช้อปคอลเลกชัน →
        </Button>
      </Box>
    </Box>
  );
}
