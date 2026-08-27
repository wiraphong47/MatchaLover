import { Box, Button, Stack, Typography } from "@mui/material";
import { assetUrl } from "../utils/assets";
export default function ProductDetails({ product, onBack, onAdd, recommendation }) {
  return (
    <Box
      component="main"
      sx={{
        p: { xs: "35px 20px 65px", md: "70px 10vw 110px" },
        minHeight: 620,
        bgcolor: "#eee9dd",
      }}
    >
      <Button
        onClick={onBack}
        sx={{
          p: 0,
          pb: 1,
          borderBottom: "1px solid #183b2a",
          borderRadius: 0,
          color: "#183b2a",
          fontSize: 17,
        }}
      >
        ← กลับไปหน้าสินค้า
      </Button>
      <Box
        sx={{
          maxWidth: 1060,
          mx: "auto",
          mt: 4,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          bgcolor: "#fffdf9",
        }}
      >
        <Box
          component="img"
          src={assetUrl(product.image)}
          alt={`${product.name} ผงมัทฉะ`}
          sx={{
            width: "100%",
            height: { xs: 300, md: 510 },
            objectFit: "cover",
          }}
        />
        <Box sx={{ p: { xs: 3.5, md: "70px 62px" } }}>
          <Typography
            sx={{
              color: "#79856a",
              fontSize: 13,
              letterSpacing: ".15em",
              fontWeight: 700,
            }}
          >
            MATCHA MORI · {product.size}
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: 40, md: 52 }, mt: 1 }}>
            {product.name}
          </Typography>
          <Typography
            sx={{
              color: "#678347",
              fontFamily: "Pridi, serif",
              fontSize: 21,
              mt: 1,
            }}
          >
            {product.thai}
          </Typography>
          <Typography
            sx={{ fontSize: 18, lineHeight: 2, color: "#627060", mt: 3 }}
          >
            {product.detail} เหมาะกับผู้ที่มองหารสชาติของมัทฉะแท้
            ที่สดใหม่และเลือกใช้ได้ตรงกับช่วงเวลาของคุณ
          </Typography>
          <Box sx={{ my: 4, borderBlock: "1px solid #dcd3c2" }}>
            {[
              ["รสสัมผัส", product.note],
              ["เหมาะสำหรับ", product.use],
            ].map(([label, value], index) => (
              <Stack
                key={label}
                direction="row"
                sx={{
                  py: 1.8,
                  gap: 2,
                  borderBottom: index === 0 ? "1px solid #dcd3c2" : 0,
                }}
              >
                <Typography sx={{ width: 115, fontSize: 15, color: "#788272" }}>
                  {label}
                </Typography>
                <Typography sx={{ fontSize: 15, fontWeight: 700 }}>
                  {value}
                </Typography>
              </Stack>
            ))}
          </Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={2}
          >
            <Typography
              sx={{
                color: "#a8874b",
                fontFamily: "Pridi, serif",
                fontSize: 33,
              }}
            >
              ฿{product.price}
            </Typography>
            <Button
              onClick={() => onAdd(product)}
              variant="contained"
              disableElevation
              sx={{
                bgcolor: "#efe2bd",
                color: "#183b2a",
                fontSize: 16,
                "&:hover": { bgcolor: "#e5d5ab" },
              }}
            >
              เพิ่มลงตะกร้า →
            </Button>
          </Stack>
          {recommendation && (
            <Box sx={{ mt: 4, p: 2.2, bgcolor: "#eef1df", borderLeft: "3px solid #a8874b" }}>
              <Typography sx={{ color: "#6c815e", fontSize: 12, fontWeight: 700, letterSpacing: ".12em" }}>แนะนำให้ลองต่อ</Typography>
              <Typography sx={{ mt: .4, fontSize: 18, fontWeight: 700 }}>{recommendation.name}</Typography>
              <Typography sx={{ color: "#536154", fontSize: 15, mt: .4 }}>{recommendation.use} · ฿{recommendation.price}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
