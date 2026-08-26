import { assetUrl } from "../utils/assets";

export default function ProductCard({ product, onView }) {
  return (
    <article className="product-card">
      <button
        className="product-preview"
        onClick={() => onView(product)}
        aria-label={`ดูรายละเอียด ${product.name}`}
      >
        <div className={`product-art ${product.color}`}>
          <img src={assetUrl(product.image)} alt={`${product.name} ผงมัทฉะ`} />
          <span className="art-size">{product.size}</span>
        </div>
      </button>
      <div className="product-info">
        <p className="eyebrow">MATCHA MORI</p>
        <h3>{product.name}</h3>
        <p className="product-thai">{product.thai}</p>
        <span className="use-pill">เหมาะสำหรับ: {product.use}</span>
        <div className="product-bottom">
          <span>{product.note}</span>
          <strong>฿{product.price}</strong>
        </div>
        <button className="add-button" onClick={() => onView(product)}>
          ดูรายละเอียด <span>→</span>
        </button>
      </div>
    </article>
  );
}
