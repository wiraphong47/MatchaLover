import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

const choices = [
  { label: "ชงดื่มเพียว ๆ", key: "pure", title: "สำหรับชงเพียว แนะนำ", names: ["Ceremonial Grade", "Asahi Matcha", "Gokou Matcha", "Samidori Matcha", "Yabukita Matcha"] },
  { label: "ทำมัทฉะลาเต้", key: "latte", title: "สำหรับมัทฉะลาเต้ แนะนำ", names: ["Premium Blend", "Okumidori Matcha", "Ujihikari Matcha"] },
  { label: "ทำขนมหรือเครื่องดื่ม", key: "baking", title: "สำหรับขนมและเครื่องดื่ม แนะนำ", names: ["Culinary Grade"] },
];

export default function RecommendationQuiz({ products, onAdd, onView }) {
  const [choice, setChoice] = useState(null);
  const recommendations = choice ? products.filter((product) => choice.names.includes(product.name)) : [];
  return (
    <Box
      component="section"
      sx={{ mt: 5, p: { xs: 3, md: 3.5 }, bgcolor: "#183b2a", color: "#fffdf9" }}
    >
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} gap={3}>
        <Box>
          <Typography
        sx={{
          color: "#d6dfac",
          letterSpacing: ".16em",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        FIND YOUR MATCHA
          </Typography>
          <Typography variant="h3" sx={{ fontSize: { xs: 29, md: 35 }, mt: 0.7 }}>
        เลือกมัทฉะที่ใช่ใน 1 คลิก
          </Typography>
          <Typography sx={{ color: "#d9e0d3", fontSize: 17, mt: 0.25 }}>
        วันนี้คุณอยากนำมัทฉะไปทำอะไร?
          </Typography>
        </Box>
        <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.2}
        sx={{ flexShrink: 0 }}
      >
        {choices.map((item) => (
          <Button
            key={item.label}
            onClick={() => setChoice(item)}
            variant={choice?.key === item.key ? "contained" : "outlined"}
            sx={{
              borderColor: "#d6dfac",
              color: choice?.key === item.key ? "#183b2a" : "#fffdf9",
              bgcolor: choice?.key === item.key ? "#efe2bd" : "transparent",
              "&:hover": {
                borderColor: "#efe2bd",
                bgcolor: "rgba(239,226,189,.12)",
              },
            }}
          >
            {item.label}
          </Button>
        ))}
        </Stack>
      </Stack>
      {choice && (
        <Box
          sx={{
            mt: 3,
            p: 2.3,
            bgcolor: "rgba(255,253,249,.1)",
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { sm: "center" },
          }}
        >
          <Box>
            <Typography sx={{ color: "#d6dfac", fontSize: 13, fontWeight: 700 }}>
              {choice.title}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
              {recommendations.map((product) => <Button key={product.name} onClick={() => onView(product)} variant="outlined" sx={{ color: "#fffdf9", borderColor: "rgba(255,255,255,.45)", "&:hover": { borderColor: "#efe2bd" } }}>{product.name} · ฿{product.price}</Button>)}
            </Stack>
            <Typography sx={{ color: "#e3e6d8", fontSize: 15, mt: 1.5 }}>
              {recommendations.map((product) => `${product.name}: ${product.note}`).join(" · ")}
            </Typography>
          </Box>
          <Button onClick={() => onAdd(recommendations[0])} variant="contained" disableElevation sx={{ bgcolor: "#efe2bd", color: "#183b2a", flexShrink: 0 }}>
            ใส่ตัวแนะนำลงตะกร้า
          </Button>
        </Box>
      )}
    </Box>
  );
}
