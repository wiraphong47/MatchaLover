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

export default function SiteHeader({ onHome }) {
  const navSx = {
    color: "#183b2a",
    fontSize: { xs: 0, md: 17 },
    "&:hover": { color: "#a8874b", bgcolor: "transparent" },
  };
  return (
    <>
      <Box
        sx={{
          py: 1,
          bgcolor: "#183b2a",
          color: "#f8f1df",
          textAlign: "center",
          fontSize: { xs: 12, md: 14 },
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
          sx={{ minHeight: { xs: 90, md: 108 }, px: { xs: 2.5, md: "8vw" } }}
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
                width: { xs: 54, md: 72 },
                height: { xs: 54, md: 72 },
                objectFit: "cover",
                objectPosition: "center 23%",
                borderRadius: "50%",
                border: "1px solid #c1aa78",
                mr: { xs: 1.4, md: 2 },
              }}
            />
            <Typography
              sx={{
                fontFamily: "Pridi, serif",
                fontSize: { xs: 25, md: 34 },
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
            sx={{ flex: 1, justifyContent: "center", gap: 1 }}
          >
            <Button href="#top" sx={navSx}>
              หน้าหลัก
            </Button>
            <Button href="#products" sx={navSx}>
              สินค้าของเรา
            </Button>
            <Button href="#story" sx={navSx}>
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
            <Button
              variant="outlined"
              sx={{
                borderColor: "#183b2a",
                color: "#183b2a",
                px: { xs: 1.3, md: 2 },
                py: 1,
                fontSize: { xs: 11, md: 16 },
              }}
            >
              ตะกร้าสินค้า{" "}
              <Chip
                label="0"
                size="small"
                sx={{
                  ml: 1,
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
