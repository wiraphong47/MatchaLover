import { Box, Button, Stack, Typography } from "@mui/material";
import { assetUrl } from "../utils/assets";
export default function BrewTools({ tools, onAdd }) {
  return (
    <Box
      component="section"
      sx={{
        px: { xs: 2.5, md: "8vw" },
        py: { xs: 7, md: 10 },
        bgcolor: "#ece7db",
      }}
    >
      <Typography
        sx={{
          color: "#6c815e",
          fontSize: 13,
          letterSpacing: ".18em",
          fontWeight: 700,
        }}
      >
        BREWING ESSENTIALS
      </Typography>
      <Typography variant="h2" sx={{ fontSize: { xs: 38, md: 50 }, mt: 1 }}>
        อุปกรณ์ชงมัทฉะ
      </Typography>
      <Typography sx={{ mt: 1, color: "#607159", fontSize: 17 }}>
        เติมความสมบูรณ์ให้ทุกครั้งที่ชง ด้วยอุปกรณ์แบบดั้งเดิม
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)" },
          gap: 2.5,
          mt: 4,
        }}
      >
        {tools.map((tool) => (
          <Box
            key={tool.name}
            sx={{
              bgcolor: "#fffdf9",
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "42% 1fr" },
            }}
          >
            <Box
              component="img"
              src={assetUrl(tool.image)}
              alt={tool.name}
              sx={{
                width: "100%",
                height: { xs: 230, sm: "100%" },
                minHeight: 220,
                objectFit: "cover",
              }}
            />
            <Box sx={{ p: 3 }}>
              <Typography variant="h3" sx={{ fontSize: 27 }}>
                {tool.name}
              </Typography>
              <Typography sx={{ color: "#678347", mt: 0.4 }}>
                {tool.subtitle}
              </Typography>
              <Typography
                sx={{
                  color: "#607159",
                  fontSize: 15,
                  lineHeight: 1.7,
                  mt: 1.4,
                }}
              >
                {tool.description}
              </Typography>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 2 }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: 20 }}>
                  ฿{tool.price}
                </Typography>
                <Button
                  onClick={() => onAdd({ ...tool, size: "1 ชิ้น" })}
                  variant="contained"
                  disableElevation
                >
                  ใส่ตะกร้า
                </Button>
              </Stack>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
