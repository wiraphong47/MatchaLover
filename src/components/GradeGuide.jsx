export default function GradeGuide({ products }) {
  return (
    <div className="grade-guide">
      <div className="guide-title">
        <p className="eyebrow">MATCHA GUIDE</p>
        <h3>
          3 เกรดต่างกัน
          <br />
          <em>อย่างไร?</em>
        </h3>
      </div>
      <div className="guide-items">
        {products.map((product, index) => (
          <div className="guide-item" key={product.name}>
            <span className="guide-number">0{index + 1}</span>
            <div>
              <h4>{product.name}</h4>
              <p>{product.detail}</p>
              <b>เหมาะสำหรับ: {product.use}</b>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
