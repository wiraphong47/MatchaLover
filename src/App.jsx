import { useState } from "react";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import { products } from "./data/products";
import { brewTools, packages } from "./data/collections";
import useShop from "./hooks/useShop";
import { createMemberId } from "./utils/member";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartDrawer from "./components/CartDrawer";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterDialog from "./pages/RegisterDialog";
import MemberPage from "./pages/MemberPage";

export default function App() {
  const shop = useShop();
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => sessionStorage.getItem("matcha-mori-session") === "true"
  );
  const {
    addToCart,
    addProductToCart,
    cart,
    cartCount,
    changeQuantity,
    completeOrder,
    couponApplied,
    couponCode,
    customer,
    orders,
    setCart,
    setCouponCode,
    setCustomer,
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
    else if (customer) goTo("login");
    else openRegistration();
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
      if (customer) goTo("login");
      else openRegistration();
      return;
    }
    goTo("checkout");
  };
  const startCheckout = () => {
    if (!isLoggedIn) {
      setCartOpen(false);
      if (customer) goTo("login");
      else openRegistration();
      return;
    }
    setCartOpen(false);
    goTo("checkout");
  };
  const saveCustomer = (profile) => {
    setCustomer({
      ...profile,
      memberId: profile.memberId || createMemberId(profile),
    });
    setIsLoggedIn(true);
    sessionStorage.setItem("matcha-mori-session", "true");
    if (pendingCheckout) {
      setPendingCheckout(false);
      goTo("checkout");
    }
  };
  const login = ({ username, password }) => {
    if (customer?.username !== username || customer?.password !== password)
      return false;
    setIsLoggedIn(true);
    sessionStorage.setItem("matcha-mori-session", "true");
    if (pendingCheckout) {
      setPendingCheckout(false);
      goTo("checkout");
    } else goTo("member");
    return true;
  };
  const logout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("matcha-mori-session");
    goTo("home");
  };
  const confirmCheckout = (payment) => {
    completeOrder({ ...payment, customer });
    goTo("member");
  };
  const content = (() => {
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
            onSave={saveCustomer}
            onLogout={logout}
          />
        );
      default:
        return (
          <HomePage
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
        onSave={saveCustomer}
      />
    </>
  );
}
