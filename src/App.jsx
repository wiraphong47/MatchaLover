import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import SiteHeader from "./components/SiteHeader";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import GradeGuide from "./components/GradeGuide";
import TrustFeatures from "./components/TrustFeatures";
import ProductDetails from "./components/ProductDetails";
import SiteFooter from "./components/SiteFooter";
import { products } from "./data/products";
import { assetUrl } from "./utils/assets";

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const scrollToProducts = () =>
    document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" });
  const returnToProducts = () => {
    setSelectedProduct(null);
    window.setTimeout(
      () =>
        document
          .querySelector("#products")
          ?.scrollIntoView({ behavior: "smooth" }),
      0,
    );
  };
  const returnHome = () => {
    setSelectedProduct(null);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };
  if (selectedProduct)
    return (
      <>
        <SiteHeader onHome={returnHome} />
        <ProductDetails product={selectedProduct} onBack={returnToProducts} />
        <SiteFooter />
      </>
    );
  return (
    <>
      <SiteHeader onHome={returnHome} />
      <Box component="main">
        <Hero onShopClick={scrollToProducts} />
        <Box
          component="section"
          id="story"
          sx={{
            maxWidth: 760,
            mx: "auto",

            pb: { xs: 4, md: 4 },
            px: 2.5,
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              color: "#6c815e",
              fontSize: 13,
              letterSpacing: ".18em",
              fontWeight: 700,
              mt: 2,
            }}
          >
            THE MATCHA MORI PHILOSOPHY
          </Typography>
          <Typography variant="h2" sx={{ fontSize: { xs: 40, md: 52 }, mt: 2 }}>
            มัทฉะแท้{" "}
            <Box
              component="em"
              sx={{
                color: "#547d3b",
                fontStyle: "normal",
                fontFamily: '"Noto Sans Thai", sans-serif',
              }}
            >
              คุณภาพพรีเมียม
            </Box>
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 18, md: 19 },
              lineHeight: 2,
              color: "#536154",
              mt: 3,
              maxWidth: 610,
              mx: "auto",
              mb: 3,
            }}
          >
            เราคัดสรรใบชาสีเขียวสดจากแหล่งปลูกชั้นดีในญี่ปุ่น
            บดอย่างพิถีพิถันด้วยหินแกรนิต เพื่อรักษากลิ่นหอม รสอูมามิ
            และสีเขียวที่งดงามตามธรรมชาติไว้ในทุกคำ
          </Typography>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={1.5}
            sx={{
              mt: 3,
              pt: 2.75,
              borderTop: "1px solid #dcd3c2",
              textAlign: { xs: "left", md: "center" },
            }}
          >
            {[
              "คัดจากแหล่งปลูกชั้นดี",
              "บดด้วยหินแบบดั้งเดิม",
              "สดใหม่ในทุกซอง",
            ].map((text, i) => (
              <Typography key={text} sx={{ fontSize: 16, color: "#526253" }}>
                <Box component="b" sx={{ color: "#a8874b", mr: 1 }}>
                  0{i + 1}
                </Box>
                {text}
              </Typography>
            ))}
          </Stack>
        </Box>
        <TrustFeatures />
        <Box
          component="section"
          id="products"
          sx={{
            py: { xs: 7, md: 9 },
            px: { xs: 2.5, md: "8vw" },
            bgcolor: "#ece7db",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="end"
            sx={{ mb: 6.5 }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#6c815e",
                  fontSize: 13,
                  letterSpacing: ".18em",
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                OUR COLLECTION
              </Typography>
              <Typography
                variant="h2"
                sx={{ fontSize: { xs: 38, md: 52 }, lineHeight: 1.15, mt: 1 }}
              >
                เลือกมัทฉะ
                <br />
                <Box
                  component="em"
                  sx={{ color: "#547d3b", fontStyle: "normal" }}
                >
                  ที่ใช่สำหรับคุณ
                </Box>
              </Typography>
            </Box>
            <Button
              href="#products"
              sx={{
                display: { xs: "none", md: "inline-flex" },
                color: "#183b2a",
                fontSize: 16,
                borderBottom: "1px solid #183b2a",
                borderRadius: 0,
              }}
            >
              ดูสินค้าทั้งหมด →
            </Button>
          </Stack>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" },
              gap: 2.5,
            }}
          >
            {products.map((product) => (
              <ProductCard
                key={product.name}
                product={product}
                onView={setSelectedProduct}
              />
            ))}
          </Box>
          <GradeGuide products={products} />
        </Box>
        <Box
          component="section"
          sx={{
            minHeight: 440,
            color: "#fff",
            px: { xs: 3.5, md: "13vw" },
            py: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: `linear-gradient(90deg,rgba(24,59,42,.94),rgba(24,59,42,.55)), url(${assetUrl("uji-matcha.jpg")}) center / cover`,
          }}
        >
          <Box>
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
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: 40, md: 52 },
                lineHeight: 1.15,
                mt: 2,
                mb: 3,
              }}
            >
              ให้ทุกวัน
              <br />
              เริ่มต้นอย่าง{" "}
              <Box
                component="em"
                sx={{ color: "#f1e4c2", fontStyle: "normal" }}
              >
                ละเมียดละไม
              </Box>
            </Typography>
            <Button
              onClick={scrollToProducts}
              variant="contained"
              disableElevation
              sx={{
                bgcolor: "#efe2bd",
                color: "#183b2a",
                fontSize: 16,
                "&:hover": { bgcolor: "#e5d5ab" },
              }}
            >
              ช้อปคอลเลกชัน →
            </Button>
          </Box>
          <Typography
            sx={{
              display: { xs: "none", md: "block" },
              fontFamily: "Pridi, serif",
              fontSize: 27,
              textAlign: "right",
              color: "#f3e6ba",
            }}
          >
            Take a moment.
            <br />
            Whisk slowly.
            <br />
            Savor deeply.
          </Typography>
        </Box>
      </Box>
      <SiteFooter />
    </>
  );
}
