import { Box, Stack, Typography } from "@mui/material";
const features = [
  ["01", "นำเข้าจากญี่ปุ่น", "คัดสรรใบชาจากแหล่งปลูกคุณภาพในญี่ปุ่น"],
  ["02", "บดด้วยหินแบบดั้งเดิม", "ช่วยรักษากลิ่นหอม สี และรสอูมามิของใบชา"],
  ["03", "จัดส่งสดใหม่", "บรรจุอย่างพิถีพิถันเพื่อคงคุณภาพในทุกซอง"],
];
export default function TrustFeatures() {
  return (
    <Box
      component="section"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" },
        px: { xs: 3, md: "8vw" },
        py: { xs: 1, md: 6.25 },
        bgcolor: "#f2ecdf",
        borderBlock: "1px solid #dfd4c0",
      }}
    >
      {features.map(([n, title, text], index) => (
        <Stack
          key={n}
          direction="row"
          gap={2}
          sx={{
            py: { xs: 2.25, md: 0 },
            pr: { md: 3.5 },

            pl: { md: index ? 3.5 : 0 },
          }}
        >
          <Typography sx={{ color: "#a8874b", fontWeight: 700, fontSize: 14 }}>
            {n}
          </Typography>
          <Box>
            <Typography variant="h3" sx={{ fontSize: 25, color: "#183b2a" }}>
              {title}
            </Typography>
            <Typography
              sx={{ color: "#627060", fontSize: 16, lineHeight: 1.7 }}
            >
              {text}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Box>
  );
}
