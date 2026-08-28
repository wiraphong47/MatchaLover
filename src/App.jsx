import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SiteHeader from "./components/SiteHeader";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import GradeGuide from "./components/GradeGuide";
import TrustFeatures from "./components/TrustFeatures";
import ProductDetails from "./components/ProductDetails";
import SiteFooter from "./components/SiteFooter";
import CustomerDialog from "./components/CustomerDialog";
import CartDrawer from "./components/CartDrawer";
import AccountPanel from "./components/AccountPanel";
import RecommendationQuiz from "./components/RecommendationQuiz";
import PackageCollection from "./components/PackageCollection";
import BrewTools from "./components/BrewTools";
import CheckoutPage from "./components/CheckoutPage";
import CatalogControls from "./components/CatalogControls";
import Reviews from "./components/Reviews";
import Faq from "./components/Faq";
import { products } from "./data/products";
import { brewTools, packages } from "./data/collections";
import { assetUrl } from "./utils/assets";

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("matcha-mori-cart") || "[]"),
  );
  const [customer, setCustomer] = useState(() =>
    JSON.parse(localStorage.getItem("matcha-mori-customer") || "null"),
  );
  const [orders, setOrders] = useState(() =>
    JSON.parse(localStorage.getItem("matcha-mori-orders") || "[]"),
  );
  const [cartOpen, setCartOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  useEffect(
    () => localStorage.setItem("matcha-mori-cart", JSON.stringify(cart)),
    [cart],
  );
  useEffect(
    () =>
      localStorage.setItem("matcha-mori-customer", JSON.stringify(customer)),
    [customer],
  );
  useEffect(
    () => localStorage.setItem("matcha-mori-orders", JSON.stringify(orders)),
    [orders],
  );
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const couponApplied = couponCode.trim().toUpperCase() === "MATCHA12";
  const matchesSearch = (item) =>
    JSON.stringify(item).toLowerCase().includes(query.trim().toLowerCase());
  const filteredProducts = products.filter(matchesSearch);
  const filteredPackages = packages.filter(matchesSearch);
  const filteredTools = brewTools.filter(matchesSearch);
  const addToCart = (product) => {
    setCart((current) =>
      current.some((item) => item.name === product.name)
        ? current.map((item) =>
            item.name === product.name
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...current, { ...product, quantity: 1 }],
    );
    setCartOpen(true);
  };
  const buyNow = (product) => {
    const nextCart = cart.some((item) => item.name === product.name)
      ? cart.map((item) =>
          item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      : [...cart, { ...product, quantity: 1 }];
    setCart(nextCart);
    if (!customer) {
      setPendingCheckout(true);
      setCustomerOpen(true);
      return;
    }
    setSelectedProduct(null);
    setCheckoutOpen(true);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
  };
  const openProduct = (product) => {
    setSelectedProduct(product);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
  };
  const changeQuantity = (name, amount) =>
    setCart((current) =>
      current
        .map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  const saveCustomer = (profile) => {
    setCustomer(profile);
    if (pendingCheckout) {
      setPendingCheckout(false);
      setSelectedProduct(null);
      setCheckoutOpen(true);
      window.setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
    }
  };
  const startCheckout = () => {
    if (!customer) {
      setCartOpen(false);
      setCustomerOpen(true);
      return;
    }
    setCartOpen(false);
    setCheckoutOpen(true);
  };
  const confirmCheckout = ({ total, discount, method, slipName }) => {
    setOrders((current) => [
      {
        id: `MM${Date.now().toString().slice(-6)}`,
        total,
        discount,
        method,
        slipName,
        coupon: couponApplied ? "MATCHA12" : null,
        items: cart,
        createdAt: new Date().toLocaleDateString("th-TH"),
      },
      ...current,
    ]);
    setCart([]);
    setCouponCode("");
    setCartOpen(false);
    setAccountOpen(true);
    setCheckoutOpen(false);
  };
  const logout = () => {
    setCustomer(null);
    setAccountOpen(false);
  };
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
    setCheckoutOpen(false);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };
  const navigateToSection = (selector) => {
    setSelectedProduct(null);
    setCheckoutOpen(false);
    window.setTimeout(
      () =>
        document
          .querySelector(selector)
          ?.scrollIntoView({ behavior: "smooth" }),
      0,
    );
  };
  if (checkoutOpen)
    return (
      <>
        <SiteHeader
          onHome={returnHome}
          onProducts={() => navigateToSection("#products")}
          onStory={() => navigateToSection("#story")}
          cartCount={cartCount}
          onOpenCart={() => setCartOpen(true)}
          onOpenAccount={() =>
            customer ? setAccountOpen(true) : setCustomerOpen(true)
          }
          customer={customer}
        />
        <CheckoutPage
          cart={cart}
          customer={customer}
          couponApplied={couponApplied}
          onBack={() => {
            setCheckoutOpen(false);
            setCartOpen(true);
          }}
          onConfirm={confirmCheckout}
        />
        <SiteFooter />
        <CustomerDialog
          open={customerOpen}
          onClose={() => setCustomerOpen(false)}
          customer={customer}
          onSave={saveCustomer}
        />
        <AccountPanel
          open={accountOpen}
          onClose={() => setAccountOpen(false)}
          customer={customer}
          orders={orders}
          onEdit={() => {
            setAccountOpen(false);
            setCustomerOpen(true);
          }}
          onLogout={logout}
        />
      </>
    );
  if (selectedProduct)
    return (
      <>
        <SiteHeader
          onHome={returnHome}
          onProducts={() => navigateToSection("#products")}
          onStory={() => navigateToSection("#story")}
          cartCount={cartCount}
          onOpenCart={() => setCartOpen(true)}
          onOpenAccount={() =>
            customer ? setAccountOpen(true) : setCustomerOpen(true)
          }
          customer={customer}
        />
        <ProductDetails
          product={selectedProduct}
          onBack={returnToProducts}
          onAdd={addToCart}
          onBuyNow={buyNow}
          recommendation={products.find(
            (item) => item.name !== selectedProduct.name,
          )}
        />
        <SiteFooter />
        <CartDrawer
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          cart={cart}
          onChangeQuantity={changeQuantity}
          onCheckout={startCheckout}
          customer={customer}
          onOpenAccount={() => {
            setCartOpen(false);
            setCustomerOpen(true);
          }}
          couponCode={couponCode}
          onCouponChange={setCouponCode}
          couponApplied={couponApplied}
        />
        <CustomerDialog
          open={customerOpen}
          onClose={() => setCustomerOpen(false)}
          customer={customer}
          onSave={saveCustomer}
        />
        <AccountPanel
          open={accountOpen}
          onClose={() => setAccountOpen(false)}
          customer={customer}
          orders={orders}
          onEdit={() => {
            setAccountOpen(false);
            setCustomerOpen(true);
          }}
          onLogout={logout}
        />
      </>
    );
  return (
    <>
      <SiteHeader
        onHome={returnHome}
        onProducts={() => navigateToSection("#products")}
        onStory={() => navigateToSection("#story")}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenAccount={() =>
          customer ? setAccountOpen(true) : setCustomerOpen(true)
        }
        customer={customer}
      />
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
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: 40, md: 52 },
              mt: 2,
              fontFamily: '"Noto Sans Thai", sans-serif',
              fontWeight: 700,
            }}
          >
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
            pt: { xs: 7, md: 9 },
            pb: query.trim() ? 0 : { xs: 7, md: 9 },
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
              }}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.name}
                  product={product}
                  onView={openProduct}
                  onAdd={addToCart}
                />
              ))}
            </Box>
          )}
          {!query.trim() && (category === "all" || category === "matcha") && (
            <>
              <RecommendationQuiz
                products={products}
                onAdd={addToCart}
                onView={openProduct}
              />
              <GradeGuide products={products} />
            </>
          )}
        </Box>
        {(category === "all" || category === "package") &&
          filteredPackages.length > 0 && (
            <PackageCollection
              packages={filteredPackages}
              products={products}
              onAdd={addToCart}
            />
          )}
        {(category === "all" || category === "tools") &&
          filteredTools.length > 0 && (
            <BrewTools tools={filteredTools} onAdd={addToCart} />
          )}
        {!query.trim() && (
          <>
            <Reviews />
            <Faq />
          </>
        )}
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
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onChangeQuantity={changeQuantity}
        onCheckout={startCheckout}
        customer={customer}
        onOpenAccount={() => {
          setCartOpen(false);
          setCustomerOpen(true);
        }}
        couponCode={couponCode}
        onCouponChange={setCouponCode}
        couponApplied={couponApplied}
      />
      <CustomerDialog
        open={customerOpen}
        onClose={() => setCustomerOpen(false)}
        customer={customer}
        onSave={saveCustomer}
      />
      <AccountPanel
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        customer={customer}
        orders={orders}
        onEdit={() => {
          setAccountOpen(false);
          setCustomerOpen(true);
        }}
        onLogout={logout}
      />
    </>
  );
}
