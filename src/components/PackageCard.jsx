import { Box, Button, Stack, Typography } from "@mui/material";
import { assetUrl } from "../utils/assets";

export default function PackageCard({ pack, onView }) {
  return (
    <Box
      sx={{
        border: "1px solid #dcd3c2",
        bgcolor: "#f5f0e5",
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src={assetUrl(pack.image)}
        alt={pack.name}
        sx={{
          width: "100%",
          height: 230,
          objectFit: "cover",
          display: "block",
        }}
      />
      <Box sx={{ p: 3 }}>
        <Typography
          sx={{
            color: "#a8874b",
            fontWeight: 700,
            letterSpacing: ".1em",
            fontSize: 12,
          }}
        >
          CURATED PACKAGE
        </Typography>
        <Typography variant="h3" sx={{ fontSize: 27, mt: 0.8 }}>
          {pack.name}
        </Typography>
        <Typography sx={{ color: "#607159", mt: 0.5, minHeight: 52 }}>
          {pack.subtitle}
        </Typography>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 2 }}
        >
          <Box>
            <Typography
              sx={{
                color: "#8b8b81",
                fontSize: 13,
                textDecoration: "line-through",
              }}
            >
              ปกติ ฿{pack.originalPrice}
            </Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 21 }}>
              ฿{pack.price}
            </Typography>
          </Box>
          <Button onClick={() => onView(pack)} sx={{ color: "#183b2a" }}>
            ดูในแพ็ก →
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
