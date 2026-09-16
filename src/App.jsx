import { useState } from "react";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import { products } from "./data/products";
import { brewTools, packages } from "./data/collections";
import useShop from "./hooks/useShop";
import useMemberAuth from "./hooks/useMemberAuth";
import { authMessage } from "./services/memberService";
import { Alert, Box, Button, CircularProgress } from "@mui/material";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartDrawer from "./components/CartDrawer";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterDialog from "./pages/RegisterDialog";
import MemberPage from "./pages/MemberPage";

export default function App() {
  const shop = useShop();
  const auth = useMemberAuth();
  const { customer, isLoggedIn } = auth;
  const [notice, setNotice] = useState(null);
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState(false);
  const {
    addToCart,
    addProductToCart,
    cart,
    cartCount,
    changeQuantity,
    completeOrder,
    couponApplied,
    couponCode,
    orders,
    setCart,
    setCouponCode,
  } = shop;
  const activeCustomer = isLoggedIn ? customer : null;

  const goTo = (nextPage) => {
    setSelectedProduct(null);
    setPage(nextPage);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
  };
  const returnHome = () => goTo("home");
  const scrollToSection = (id) => {
    setSelectedProduct(null);
    setPage("home");
    window.setTimeout(
      () =>
        document
          .querySelector(`#${id}`)
          ?.scrollIntoView({ behavior: "smooth" }),
      0
    );
  };
  const openRegistration = () => setRegisterOpen(true);
  const openMemberPortal = () => {
    if (isLoggedIn) goTo("member");
    else goTo("login");
  };
  const openProduct = (product) => {
    setSelectedProduct(product);
    setPage("product-detail");
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
  };
  const buyNow = (product) => {
    setCart(addProductToCart(product));
    if (!isLoggedIn) {
      setPendingCheckout(true);
      goTo("login");
      return;
    }
    goTo("checkout");
  };
  const startCheckout = () => {
    if (!isLoggedIn) {
      setCartOpen(false);
      setPendingCheckout(true);
      goTo("login");
      return;
    }
    setCartOpen(false);
    goTo("checkout");
  };
  const register = async (profile) => {
    const result = await auth.register(profile);
    setRegisterOpen(false);
    setNotice({
      severity: result.emailSent ? "success" : "warning",
      text: result.emailSent
        ? "สมัครสมาชิกสำเร็จและส่งอีเมลต้อนรับแล้ว"
        : "สมัครสมาชิกสำเร็จ แต่ยังส่งอีเมลต้อนรับไม่ได้",
    });
    if (pendingCheckout) {
      setPendingCheckout(false);
      goTo("checkout");
    } else goTo("member");
  };
  const login = async (credentials) => {
    await auth.login(credentials);
    setNotice(null);
    if (pendingCheckout) {
      setPendingCheckout(false);
      goTo("checkout");
    } else goTo("member");
  };
  const logout = async () => {
    try {
      await auth.logout();
      setPendingCheckout(false);
      goTo("home");
    } catch (error) {
      setNotice({ severity: "error", text: authMessage(error) });
    }
  };
  const confirmCheckout = (payment) => {
    if (!isLoggedIn || !customer) {
      goTo("login");
      return;
    }
    completeOrder({ ...payment, customer });
    goTo("member");
  };
  const content = (() => {
    if (["member", "checkout"].includes(page)) {
      if (auth.loading)
        return (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <CircularProgress aria-label="กำลังโหลดบัญชี" />
          </Box>
        );
      if (!isLoggedIn)
        return (
          <LoginPage
            onBack={returnHome}
            onLogin={login}
            onRegister={openRegistration}
          />
        );
      if (!customer)
        return (
          <Alert
            severity="error"
            sx={{ m: 3 }}
            action={<Button onClick={logout}>ออกจากระบบ</Button>}
          >
            โหลดข้อมูลสมาชิกไม่สำเร็จ กรุณารีเฟรชหน้าเว็บแล้วลองใหม่
          </Alert>
        );
    }
    if (page === "product-detail" && selectedProduct)
      return (
        <ProductDetailPage
          product={selectedProduct}
          onBack={() => scrollToSection("products")}
          onAdd={addToCart}
          onBuyNow={buyNow}
          recommendation={products.find(
            (item) => item.name !== selectedProduct.name
          )}
        />
      );
    switch (page) {
      case "checkout":
        return (
          <CheckoutPage
            cart={cart}
            customer={customer}
            couponApplied={couponApplied}
            onBack={() => {
              scrollToSection("products");
              setCartOpen(true);
            }}
            onConfirm={confirmCheckout}
          />
        );
      case "login":
        return (
          <LoginPage
            customer={customer}
            onBack={returnHome}
            onLogin={login}
            onRegister={openRegistration}
          />
        );
      case "member":
        return (
          <MemberPage
            customer={customer}
            orders={orders}
            onBack={returnHome}
            onSave={auth.save}
            onLogout={logout}
          />
        );
      default:
        return (
          <HomePage
            onSavePreferences={auth.save}
            customer={activeCustomer}
            products={products}
            packages={packages}
            tools={brewTools}
            onAdd={addToCart}
            onOpenProduct={openProduct}
            onScrollTo={scrollToSection}
          />
        );
    }
  })();

  return (
    <>
      <SiteHeader
        onHome={returnHome}
        onProducts={() => scrollToSection("products")}
        onStory={() => scrollToSection("story")}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenAccount={openMemberPortal}
        onLogin={() => goTo("login")}
        onRegister={openRegistration}
        customer={activeCustomer}
      />
      {notice && (
        <Alert severity={notice.severity} onClose={() => setNotice(null)}>
          {notice.text}
        </Alert>
      )}
      {auth.error && <Alert severity="error">{auth.error}</Alert>}
      {content}
      <SiteFooter />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onChangeQuantity={changeQuantity}
        onCheckout={startCheckout}
        customer={activeCustomer}
        onOpenAccount={openMemberPortal}
        couponCode={couponCode}
        onCouponChange={setCouponCode}
        couponApplied={couponApplied}
      />
      <RegisterDialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        customer={null}
        onSave={register}
      />
    </>
  );
}
