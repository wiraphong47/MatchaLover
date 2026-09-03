import {
  AppBar,
  Box,
  Button,
  Chip,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { assetUrl } from "../utils/assets";

export default function SiteHeader({ onHome, onProducts, onStory, cartCount, onOpenCart, onOpenAccount, customer }) {
  const navSx = {
    color: "#183b2a",
    fontSize: { xs: 0, md: 17 },
    "&:hover": { color: "#a8874b", bgcolor: "transparent" },
  };
  return (
    <>
      <Box
        sx={{
          py: { xs: 0.85, md: 1 },
          bgcolor: "#183b2a",
          color: "#f8f1df",
          textAlign: "center",
          fontSize: { xs: 12, md: 14 },
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        ส่งฟรีเมื่อสั่งซื้อครบ 1,200 บาท{" "}
        <Box component="span" sx={{ mx: 1.5, color: "#c4ae7c" }}>
          ✦
        </Box>{" "}
        มัทฉะแท้จากญี่ปุ่น
      </Box>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: "#fffdf9", borderBottom: "1px solid #dcd3c2" }}
      >
        <Toolbar
          sx={{ minHeight: { xs: 76, md: 108 }, px: { xs: 1.5, md: "8vw" }, gap: { xs: 1, md: 0 } }}
        >
          <Box
            component="a"
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              onHome?.();
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#183b2a",
              textDecoration: "none",
              minWidth: { md: "27%" },
            }}
          >
            <Box
              component="img"
              src={assetUrl("matcha-mori-logo.png")}
              alt="Matcha Mori"
              sx={{
                width: { xs: 45, md: 72 },
                height: { xs: 45, md: 72 },
                objectFit: "cover",
                objectPosition: "center 23%",
                borderRadius: "50%",
                border: "1px solid #c1aa78",
                mr: { xs: 0.9, md: 2 },
              }}
            />
            <Typography
              sx={{
                fontFamily: "Pridi, serif",
                fontSize: { xs: 21, md: 34 },
                lineHeight: 0.76,
                fontWeight: 600,
              }}
            >
              Matcha
              <br />
              <Box component="i" sx={{ fontWeight: 500 }}>
                Mori
              </Box>
            </Typography>
          </Box>
          <Stack
            direction="row"
            sx={{ flex: 1, justifyContent: "center", gap: 1, display: { xs: "none", md: "flex" } }}
          >
            <Button
              href="#top"
              onClick={(event) => {
                event.preventDefault();
                onHome?.();
              }}
              sx={navSx}
            >
              หน้าหลัก
            </Button>
            <Button href="#products" onClick={(event) => { event.preventDefault(); onProducts?.(); }} sx={navSx}>
              สินค้าของเรา
            </Button>
            <Button href="#story" onClick={(event) => { event.preventDefault(); onStory?.(); }} sx={navSx}>
              เรื่องราวของเรา
            </Button>
          </Stack>
          <Box
            sx={{
              minWidth: { md: "27%" },
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button onClick={onOpenAccount} sx={{ color: "#183b2a", mr: { xs: 0, md: 1 }, px: { xs: .6, md: 1 }, fontSize: { xs: 12, md: 16 }, whiteSpace: "nowrap" }}>
              {customer ? "บัญชีของฉัน" : "สมัครสมาชิก"}
            </Button>
            <Button
              onClick={onOpenCart}
              variant="outlined"
              sx={{
                borderColor: "#183b2a",
                color: "#183b2a",
                px: { xs: .8, md: 2 },
                py: { xs: .75, md: 1 },
                fontSize: { xs: 0, md: 16 },
              }}
            >
              ตะกร้าสินค้า{" "}
              <Chip
                label={cartCount}
                size="small"
                sx={{
                  ml: { xs: 0, md: 1 },
                  height: 18,
                  color: "#fff",
                  bgcolor: "#a8874b",
                  "& .MuiChip-label": { px: 0.7, fontSize: 11 },
                }}
              />
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
}
