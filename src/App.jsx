import { useEffect, useState } from "react";
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
import MemberPage from "./pages/MemberPage";
import OrderSummaryPage from "./pages/OrderSummaryPage";
import ShopPage from "./pages/ShopPage";
import MatchaFinderPage from "./pages/MatchaFinderPage";
import RegisterPage from "./pages/RegisterPage";
import BrewGuidePage from "./pages/BrewGuidePage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  const shop = useShop();
  const auth = useMemberAuth();
  const { customer, isLoggedIn } = auth;
  const [notice, setNotice] = useState(null);
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState(false);
  const [memberInitialTab, setMemberInitialTab] = useState("profile");
  const {
    addToCart,
    addProductToCart,
    cart,
    cartCount,
    changeQuantity,
    completeOrder,
    confirmedOrder,
    couponApplied,
    couponCode,
    orders,
    orderBusy,
    orderError,
    clearOrderError,
    resendConfirmationEmail,
    setCart,
    setCouponCode,
  } = shop;
  const activeCustomer = isLoggedIn ? customer : null;

  useEffect(() => {
    const openRichMenuLink = () => {
      const action = decodeURIComponent(window.location.hash.slice(1)).replace(
        /^\/+/,
        ""
      );
      if (!action) return;
      setSelectedProduct(null);
      const route = {
        shop: "shop",
        products: "shop",
        "matcha-finder": "matcha-finder",
        register: "register",
        "brew-guide": "brew-guide",
        contact: "contact",
      }[action];
      if (route) {
        setPage(route);
        window.scrollTo({ top: 0, behavior: "auto" });
        return;
      }
      const targetId = {
        top: "top",
        story: "story",
      }[action];
      if (!targetId) return;
      setPage("home");
      window.setTimeout(
        () =>
          document
            .getElementById(targetId)
            ?.scrollIntoView({ behavior: "smooth", block: "start" }),
        100
      );
    };

    openRichMenuLink();
    window.addEventListener("hashchange", openRichMenuLink);
    window.addEventListener("popstate", openRichMenuLink);
    return () => {
      window.removeEventListener("hashchange", openRichMenuLink);
      window.removeEventListener("popstate", openRichMenuLink);
    };
  }, []);

  const goTo = (nextPage) => {
    const richMenuPath = {
      shop: "/shop",
      "matcha-finder": "/matcha-finder",
      register: "/register",
      "brew-guide": "/brew-guide",
      contact: "/contact",
    }[nextPage];
    const baseUrl = `${window.location.pathname}${window.location.search}`;
    window.history.pushState(
      null,
      "",
      richMenuPath ? `${baseUrl}#${richMenuPath}` : baseUrl
    );
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
  const openRegistration = () => goTo("register");
  const openMemberPortal = () => {
    if (isLoggedIn) {
      setMemberInitialTab("profile");
      goTo("member");
    } else goTo("login");
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
  const confirmCheckout = async (payment) => {
    if (!isLoggedIn || !customer) {
      goTo("login");
      return;
    }
    try {
      const order = await completeOrder({ ...payment, customer });
      setNotice({
        severity:
          order.emailSent === true
            ? "success"
            : order.emailSent === false
              ? "warning"
              : "info",
        text:
          order.emailSent === true
            ? "บันทึกคำสั่งซื้อและส่งสรุปไปยังอีเมลของคุณแล้ว"
            : order.emailSent === false
              ? "บันทึกคำสั่งซื้อแล้ว แต่ยังส่งอีเมลสรุปไม่สำเร็จ"
              : "บันทึกคำสั่งซื้อในโหมดทดลองแล้ว แต่ยังไม่ได้ส่งอีเมลจริง",
      });
      goTo("order-summary");
    } catch {
      // useShop แสดงข้อความจากเซิร์ฟเวอร์ไว้ในหน้าชำระเงินแล้ว
    }
  };
  const content = (() => {
    if (["member", "checkout", "order-summary"].includes(page)) {
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
      case "shop":
        return (
          <ShopPage
            products={products}
            onAdd={addToCart}
            onOpenProduct={openProduct}
          />
        );
      case "matcha-finder":
        return (
          <MatchaFinderPage
            products={products}
            customer={activeCustomer}
            onSavePreferences={auth.save}
            onAdd={addToCart}
            onOpenProduct={openProduct}
          />
        );
      case "register":
        return <RegisterPage onSave={register} onBack={returnHome} />;
      case "brew-guide":
        return <BrewGuidePage />;
      case "contact":
        return (
          <ContactPage
            onBackToLine={() => {
              if (window.history.length > 1) window.history.back();
              else window.close();
            }}
          />
        );
      case "checkout":
        return (
          <CheckoutPage
            cart={cart}
            customer={customer}
            couponApplied={couponApplied}
            busy={orderBusy}
            error={orderError}
            onBack={() => {
              clearOrderError();
              scrollToSection("products");
              setCartOpen(true);
            }}
            onConfirm={confirmCheckout}
          />
        );
      case "order-summary":
        return (
          <OrderSummaryPage
            order={confirmedOrder}
            onContinue={() => scrollToSection("products")}
            onViewOrders={() => {
              setMemberInitialTab("orders");
              goTo("member");
            }}
            onResendEmail={resendConfirmationEmail}
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
            initialTab={memberInitialTab}
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
        onProducts={() => goTo("shop")}
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
    </>
  );
}
