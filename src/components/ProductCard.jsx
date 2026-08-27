import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { assetUrl } from "../utils/assets";

export default function ProductCard({ product, onView, onAdd }) {
  return (
    <Box
      component="article"
      sx={{
        bgcolor: "#fffdf9",
        transition: "transform .25s",
        "&:hover": { transform: "translateY(-5px)" },
      }}
    >
      <Button
        onClick={() => onView(product)}
        aria-label={`ดูรายละเอียด ${product.name}`}
        sx={{ p: 0, display: "block", width: "100%", minWidth: 0 }}
      >
        <Box
          sx={{
            height: 350,
            position: "relative",
            overflow: "hidden",
            bgcolor: "#e1dfcf",
          }}
        >
          <Box
            component="img"
            src={assetUrl(product.image)}
            alt={`${product.name} ผงมัทฉะ`}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <Chip
            label={product.size}
            size="small"
            sx={{
              position: "absolute",
              right: 16,
              bottom: 15,
              bgcolor: "rgba(255,253,249,.92)",
              color: "#183b2a",
              borderRadius: 0,
            }}
          />
        </Box>
      </Button>
      <Box sx={{ p: "22px 4px 12px" }}>
        <Typography
          sx={{
            color: "#79856a",
            fontSize: 13,
            letterSpacing: ".15em",
            fontWeight: 700,
          }}
        >
          MATCHA MORI
        </Typography>
        <Typography
          variant="h3"
          sx={{ color: "#183b2a", fontSize: 29, mt: 0.4 }}
        >
          {product.name}
        </Typography>
        <Typography sx={{ color: "#607159", fontSize: 17, mt: 0.3, mb: 1.3 }}>
          {product.thai}
        </Typography>
        <Chip
          label={`เหมาะสำหรับ: ${product.use}`}
          sx={{
            borderRadius: 0,
            bgcolor: "#eef1df",
            color: "#4f693d",
            fontSize: 14,
            height: "auto",
            py: 0.35,
            "& .MuiChip-label": { whiteSpace: "normal" },
          }}
        />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="end"
          sx={{
            mt: 2.25,
            pt: 1.5,
            borderTop: "1px solid #dcd3c2",
            color: "#687464",
            fontSize: 14,
          }}
        >
          <Typography sx={{ fontSize: 14 }}>{product.note}</Typography>
          <Typography sx={{ color: "#183b2a", fontSize: 17, fontWeight: 700 }}>
            ฿{product.price}
          </Typography>
        </Stack>
        <Button
          onClick={() => onView(product)}
          sx={{
            px: 0,
            pt: 1.7,
            color: "#183b2a",
            fontSize: 16,
            "&:hover": { bgcolor: "transparent", color: "#a8874b" },
          }}
        >
          ดูรายละเอียด&nbsp; →
        </Button>
        <Button
          onClick={() => onAdd(product)}
          variant="contained"
          disableElevation
          fullWidth
          sx={{ mt: 1, bgcolor: "#183b2a", fontSize: 16, "&:hover": { bgcolor: "#28573f" } }}
        >
          เพิ่มลงตะกร้า
        </Button>
      </Box>
    </Box>
  );
}
