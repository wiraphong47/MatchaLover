import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from "@mui/material";
const questions = [
  ["ชงมัทฉะอย่างไรให้อร่อย?", "ร่อนมัทฉะ 1–2 ช้อนชา เติมน้ำร้อนอุณหภูมิ 70–80°C ประมาณ 60 มล. แล้วตีด้วย Chasen เป็นรูปตัว W จนเนียนและเกิดฟองละเอียด"],
  ["ควรเก็บมัทฉะอย่างไร?", "ปิดฝาให้สนิท เก็บในที่แห้งและเย็น หลีกเลี่ยงแสงและความชื้น หลังเปิดซองควรดื่มให้หมดภายใน 1–2 เดือนเพื่อกลิ่นและสีที่ดีที่สุด"],
  ["Ceremonial, Premium และ Culinary ต่างกันอย่างไร?", "Ceremonial นุ่มและอูมามิ เหมาะชงเพียว ๆ; Premium สมดุล ดื่มง่าย เหมาะลาเต้; Culinary รสเข้มและสีชัด เหมาะทำขนมและเครื่องดื่ม"],
  ["มัทฉะหนึ่งซองชงได้กี่แก้ว?", "โดยเฉลี่ย 30g ชงได้ประมาณ 15 แก้ว และ 100g ชงได้ประมาณ 50 แก้ว ขึ้นกับปริมาณที่ใช้ต่อแก้ว"],
];
export default function Faq() { return <Box component="section" sx={{ px: { xs: 2.5, md: "18vw" }, py: { xs: 7, md: 10 }, bgcolor: "#ece7db" }}><Typography sx={{ color: "#6c815e", fontSize: 13, letterSpacing: ".18em", fontWeight: 700 }}>HELP & GUIDE</Typography><Typography variant="h2" sx={{ fontSize: { xs: 38, md: 50 }, mt: 1, mb: 3 }}>คำถามที่พบบ่อย</Typography>{questions.map(([question, answer]) => <Accordion key={question} disableGutters elevation={0} sx={{ bgcolor: "transparent", borderTop: "1px solid #d4cbb9", "&:before": { display: "none" } }}><AccordionSummary expandIcon="+"><Typography sx={{ fontWeight: 700, fontSize: 18 }}>{question}</Typography></AccordionSummary><AccordionDetails><Typography sx={{ color: "#607159", lineHeight: 1.9, fontSize: 17 }}>{answer}</Typography></AccordionDetails></Accordion>)}</Box>; }
