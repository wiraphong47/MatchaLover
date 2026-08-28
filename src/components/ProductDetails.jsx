import { Box, Button, Stack, Typography } from "@mui/material";
import { assetUrl } from "../utils/assets";
export default function ProductDetails({ product, onBack, onAdd, onBuyNow, recommendation }) {
  return (
    <Box
      component="main"
      sx={{
        p: { xs: "28px 20px 65px", md: "48px 10vw 88px" },
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
          mt: 3,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          bgcolor: "#fffdf9",
          boxShadow: "0 18px 50px rgba(31,52,37,.08)",
        }}
      >
        <Box
          component="img"
          src={assetUrl(product.image)}
          alt={`${product.name} ผงมัทฉะ`}
          sx={{
            width: "100%",
            height: { xs: 320, md: 530 },
            objectFit: "cover",
          }}
        />
        <Box sx={{ p: { xs: 3.5, md: "52px 58px" } }}>
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
              ...(product.aroma ? [["กลิ่น", product.aroma], ["รส", product.taste], ["สำหรับคนไทย", product.thaiPreference], ["แหล่งปลูก", product.origin]] : []),
            ].map(([label, value], index) => (
              <Stack
                key={label}
                direction="row"
                sx={{
                  py: 1.8,
                  gap: 2,
                  borderBottom: "1px solid #dcd3c2",
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
            direction={{ xs: "column", sm: "row" }}
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
            <Stack direction="row" spacing={1}>
              <Button onClick={() => onAdd(product)} variant="outlined" sx={{ borderColor: "#183b2a", color: "#183b2a", fontSize: 16 }}>เพิ่มตะกร้า</Button>
              <Button onClick={() => onBuyNow(product)} variant="contained" disableElevation sx={{ bgcolor: "#183b2a", fontSize: 16, "&:hover": { bgcolor: "#28573f" } }}>ชำระเงินเลย</Button>
            </Stack>
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
