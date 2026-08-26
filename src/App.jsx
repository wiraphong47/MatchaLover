import SiteHeader from "./components/SiteHeader";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import GradeGuide from "./components/GradeGuide";
import SiteFooter from "./components/SiteFooter";
import TrustFeatures from "./components/TrustFeatures";
import ProductDetails from "./components/ProductDetails";
import { products } from "./data/products";
import { useState } from "react";

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const scrollToProducts = () =>
    document.querySelector("#products").scrollIntoView({ behavior: "smooth" });
  const returnToProducts = () => {
    setSelectedProduct(null);
    window.setTimeout(
      () =>
        document
          .querySelector("#products")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      0,
    );
  };
  if (selectedProduct)
    return (
      <>
        <SiteHeader />
        <ProductDetails product={selectedProduct} onBack={returnToProducts} />
        <SiteFooter />
      </>
    );
  return (
    <>
      <SiteHeader />
      <main>
        <Hero onShopClick={scrollToProducts} />
        <section className="intro" id="story">
          <p className="eyebrow">THE MATCHA MORI PHILOSOPHY</p>
          <h2>
            มัทฉะแท้ <em>คุณภาพพรีเมียม</em>
          </h2>
          <p>
            เราคัดสรรใบชาสีเขียวสดจากแหล่งปลูกชั้นดีในญี่ปุ่น
            บดอย่างพิถีพิถันด้วยหินแกรนิต เพื่อรักษากลิ่นหอม รสอูมามิ
            และสีเขียวที่งดงามตามธรรมชาติไว้ในทุกคำ
          </p>
          <div className="values">
            <span>
              <b>01</b> คัดจากแหล่งปลูกชั้นดี
            </span>
            <span>
              <b>02</b> บดด้วยหินแบบดั้งเดิม
            </span>
            <span>
              <b>03</b> สดใหม่ในทุกซอง
            </span>
          </div>
        </section>
        <TrustFeatures />
        <section className="products-section" id="products">
          <div className="section-heading">
            <div>
              <p className="eyebrow">OUR COLLECTION</p>
              <h2>
                เลือกมัทฉะ
                <br />
                <em>ที่ใช่สำหรับคุณ</em>
              </h2>
            </div>
            <a href="#products">
              ดูสินค้าทั้งหมด <span>→</span>
            </a>
          </div>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard
                key={product.name}
                product={product}
                onView={setSelectedProduct}
              />
            ))}
          </div>
          <GradeGuide products={products} />
        </section>
        <section className="ritual">
          <div>
            <p className="eyebrow light">A DAILY RITUAL</p>
            <h2>
              ให้ทุกวัน
              <br />
              เริ่มต้นอย่าง <em>ละเมียดละไม</em>
            </h2>
            <button className="button cream" onClick={scrollToProducts}>
              ช้อปคอลเลกชัน <span>→</span>
            </button>
          </div>
          <p className="ritual-side">
            Take a moment.
            <br />
            Whisk slowly.
            <br />
            Savor deeply.
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
