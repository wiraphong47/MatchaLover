import { Box, Button, Typography } from "@mui/material";
import { assetUrl } from "../utils/assets";

export default function Hero({ onShopClick }) {
  return (
    <Box
      component="section"
      id="top"
      sx={{
        minHeight: 610,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        bgcolor: "#183b2a",
        color: "#fffdf9",
      }}
    >
      <Box
        sx={{
          px: { xs: 3.5, md: "9vw" },
          py: { xs: 8, md: 13 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            color: "#d6dfac",
            fontSize: { xs: 12, md: 13 },
            letterSpacing: ".18em",
            fontWeight: 700,
            mb: 2.5,
          }}
        >
          MATCHA MORI · UJI, JAPAN
        </Typography>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: 48, md: "clamp(46px,5vw,72px)" },
            lineHeight: 1.12,
            letterSpacing: "-.035em",
          }}
        >
          มัทฉะแท้
          <br />
          <Box component="em" sx={{ color: "#f1e4c2", fontStyle: "normal" }}>
            คุณภาพพรีเมียม
          </Box>
        </Typography>
        <Typography
          sx={{
            color: "#e3e6d8",
            fontSize: { xs: 18, md: 19 },
            mt: 2.5,
            mb: 4,
          }}
        >
          คัดสรรเพื่อช่วงเวลาที่ละเมียดละไมของคุณ
        </Typography>
        <Button
          onClick={onShopClick}
          variant="contained"
          disableElevation
          sx={{
            alignSelf: "flex-start",
            bgcolor: "#efe2bd",
            color: "#183b2a",
            px: 2.8,
            py: 1.5,
            fontSize: 16,
            "&:hover": { bgcolor: "#e5d5ab" },
          }}
        >
          เลือกมัทฉะของคุณ&nbsp; →
        </Button>
      </Box>
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 340, md: 610 },
          bgcolor: "#ddd4bd",
        }}
      >
        <Box
          component="img"
          src={assetUrl("uji-matcha.jpg")}
          alt="ผงมัทฉะ Uji Kyoto"
          sx={{
            width: "100%",
            height: "100%",
            position: "absolute",
            objectFit: "cover",
          }}
        />
        <Typography
          sx={{
            position: "absolute",
            right: 20,
            bottom: 35,
            writingMode: "vertical-rl",
            color: "#fffaf0",
            fontSize: 10,
            letterSpacing: ".2em",
          }}
        >
          CEREMONIAL MOMENTS
        </Typography>
      </Box>
    </Box>
  );
}
