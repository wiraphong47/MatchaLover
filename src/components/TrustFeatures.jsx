const features = [
  ["01", "นำเข้าจากญี่ปุ่น", "คัดสรรใบชาจากแหล่งปลูกคุณภาพในญี่ปุ่น"],
  ["02", "บดด้วยหินแบบดั้งเดิม", "ช่วยรักษากลิ่นหอม สี และรสอูมามิของใบชา"],
  ["03", "จัดส่งสดใหม่", "บรรจุอย่างพิถีพิถันเพื่อคงคุณภาพในทุกซอง"],
];

export default function TrustFeatures() {
  return (
    <section className="trust-features" aria-label="จุดเด่น Matcha Mori">
      {features.map(([number, title, text]) => (
        <article key={number}>
          <span>{number}</span>
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
