import { assetUrl } from "../utils/assets";

export default function SiteHeader() {
  return (
    <>
      <div className="announcement">
        ส่งฟรีเมื่อสั่งซื้อครบ 1,200 บาท <span>✦</span> มัทฉะแท้จากญี่ปุ่น
      </div>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Matcha Mori หน้าแรก">
          <img src={assetUrl("matcha-mori-logo.png")} alt="Matcha Mori" />
          <span>
            Matcha
            <br />
            <i>Mori</i>
          </span>
        </a>
        <nav aria-label="เมนูหลัก">
          <a href="#top">หน้าหลัก</a>
          <a href="#products">สินค้าของเรา</a>
          <a href="#story">เรื่องราวของเรา</a>
        </nav>
        <div className="header-actions">
          <button className="bag" aria-label="ตะกร้าสินค้า">
            ตะกร้าสินค้า <b>0</b>
          </button>
        </div>
      </header>
    </>
  );
}
