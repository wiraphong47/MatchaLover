import { Box, Button, Typography } from "@mui/material";
import { useState } from "react";

export default function GradeGuide({ products }) {
  const [showAll, setShowAll] = useState(false);
  const visibleProducts = showAll ? products : products.slice(0, 3);
  return (
    <Box
      sx={{
        mt: { xs: 7.5, md: 12 },
        p: { xs: 3.25, md: 6 },
        bgcolor: "#183b2a",
        color: "#fdf9eb",
        borderTop: "1px solid #bca36f",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "26% 1fr" },
        gap: { xs: 3.5, md: 6 },
      }}
    >
      <Box>
        <Typography
          sx={{
            color: "#d9db98",
            fontSize: 13,
            letterSpacing: ".18em",
            fontWeight: 700,
          }}
        >
          MATCHA GUIDE
        </Typography>
        <Typography
          variant="h3"
          sx={{ fontSize: { xs: 34, md: 39 }, lineHeight: 1.15, mt: 1 }}
        >
          แต่ละอันแตกต่างกันอย่างไร? <br />
          <br />
        </Typography>
      </Box>
      <Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" },
            gap: 3.75,
          }}
        >
        {visibleProducts.map((p, index) => (
          <Box
            key={p.name}
            sx={{
              display: "flex",
              gap: 1.5,
              pl: 2.25,
              borderLeft: "1px solid rgba(247,241,223,.24)",
            }}
          >
            <Typography
              sx={{ color: "#d6c18e", fontWeight: 700, fontSize: 14 }}
            >
              0{index + 1}
            </Typography>
            <Box>
              <Typography
                variant="h4"
                sx={{ fontFamily: "Pridi, serif", fontSize: 23 }}
              >
                {p.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: 15,
                  color: "#d8e0d0",
                  lineHeight: 1.65,
                  my: 0.5,
                }}
              >
                {p.detail}
              </Typography>
              <Typography
                sx={{ fontSize: 14, color: "#f3dc9b", fontWeight: 700 }}
              >
                เหมาะสำหรับ: {p.use}
              </Typography>
            </Box>
          </Box>
        ))}
        </Box>
        {products.length > 3 && (
          <Button
            onClick={() => setShowAll((current) => !current)}
            variant="outlined"
            sx={{
              mt: 3.5,
              color: "#fdf9eb",
              borderColor: "#d6c18e",
              "&:hover": { borderColor: "#f3dc9b", bgcolor: "rgba(255,255,255,.06)" },
            }}
          >
            {showAll ? "แสดงน้อยลง" : `แสดงเพิ่มเติม (${products.length - 3} รายการ)`}
          </Button>
        )}
      </Box>
    </Box>
  );
}
