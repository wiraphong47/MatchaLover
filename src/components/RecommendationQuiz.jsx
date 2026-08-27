import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

const choices = [
  { label: "ชงดื่มเพียว ๆ", index: 0 },
  { label: "ทำมัทฉะลาเต้", index: 1 },
  { label: "ทำขนมหรือเครื่องดื่ม", index: 2 },
];

export default function RecommendationQuiz({ products, onAdd, onView }) {
  const [choice, setChoice] = useState(null);
  const product = choice === null ? null : products[choice];
  return (
    <Box
      component="section"
      sx={{ mt: 5, p: { xs: 3, md: 4 }, bgcolor: "#183b2a", color: "#fffdf9" }}
    >
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
      <Typography variant="h3" sx={{ fontSize: { xs: 29, md: 35 }, mt: 1 }}>
        เลือกมัทฉะที่ใช่ใน 1 คลิก
      </Typography>
      <Typography sx={{ color: "#d9e0d3", fontSize: 17, mt: 0.5 }}>
        วันนี้คุณอยากนำมัทฉะไปทำอะไร?
      </Typography>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.2}
        sx={{ mt: 2.5 }}
      >
        {choices.map((item) => (
          <Button
            key={item.label}
            onClick={() => setChoice(item.index)}
            variant={choice === item.index ? "contained" : "outlined"}
            sx={{
              borderColor: "#d6dfac",
              color: choice === item.index ? "#183b2a" : "#fffdf9",
              bgcolor: choice === item.index ? "#efe2bd" : "transparent",
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
      {product && (
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
            <Typography sx={{ color: "#d6dfac", fontSize: 13 }}>
              เราแนะนำ
            </Typography>
            <Typography sx={{ fontSize: 23, fontWeight: 700 }}>
              {product.name}
            </Typography>
            <Typography sx={{ color: "#e3e6d8" }}>
              {product.note} · ฿{product.price}
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Button onClick={() => onView(product)} sx={{ color: "#fffdf9" }}>
              ดูรายละเอียด
            </Button>
            <Button
              onClick={() => onAdd(product)}
              variant="contained"
              disableElevation
              sx={{ bgcolor: "#efe2bd", color: "#183b2a" }}
            >
              ใส่ตะกร้า
            </Button>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
