import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { assetUrl } from "../utils/assets";

export default function PackageCollection({ packages, onAdd }) {
  const [selected, setSelected] = useState(null);
  const [imageOpen, setImageOpen] = useState(false);
  return (
    <>
      <Box
        component="section"
        sx={{
          bgcolor: "#fffdf9",
          px: { xs: 2.5, md: "8vw" },
          py: { xs: 7, md: 10 },
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
          MATCHA SETS
        </Typography>
        <Typography variant="h2" sx={{ fontSize: { xs: 38, md: 50 }, mt: 1 }}>
          แพ็กเกจที่คัดมาให้
        </Typography>
        <Typography sx={{ mt: 1, color: "#607159", fontSize: 17 }}>
          เริ่มต้นง่ายขึ้น หรือมอบเป็นของขวัญในช่วงเวลาพิเศษ
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3,1fr)" },
            gap: 2.5,
            mt: 4,
          }}
        >
          {packages.map((pack) => (
            <Box
              key={pack.name}
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
                      sx={{ color: "#8b8b81", fontSize: 13, textDecoration: "line-through" }}
                    >
                      ปกติ ฿{pack.originalPrice}
                    </Typography>
                    <Typography sx={{ fontWeight: 700, fontSize: 21 }}>
                      ฿{pack.price}
                    </Typography>
                  </Box>
                  <Button
                    onClick={() => setSelected(pack)}
                    sx={{ color: "#183b2a" }}
                  >
                    ดูในแพ็ก →
                  </Button>
                </Stack>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
      <Dialog
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontFamily: "Pridi, serif", fontSize: 30 }}>
          {selected?.name}
        </DialogTitle>
        <DialogContent>
          {selected && (
            <>
              <Button
                onClick={() => setImageOpen(true)}
                aria-label={`เปิดรูป ${selected.name} ขนาดใหญ่`}
                sx={{ display: "block", p: 0, minWidth: 0, width: "100%", mb: 2 }}
              >
                <Box
                  component="img"
                  src={assetUrl(selected.image)}
                  alt={selected.name}
                  sx={{ width: "100%", height: 210, objectFit: "cover", display: "block" }}
                />
              </Button>
              <Typography sx={{ color: "#607159", fontSize: 17 }}>
                {selected.description}
              </Typography>
              <Typography sx={{ mt: 2.5, fontWeight: 700, fontSize: 18 }}>
                ภายในแพ็กประกอบด้วย
              </Typography>
              <Stack component="ul" spacing={0.7} sx={{ pl: 2.5, mt: 1 }}>
                {selected.items.map((item) => (
                  <Stack component="li" key={item.name} direction="row" justifyContent="space-between" sx={{ color: "#415444", pr: 1 }}>
                    <Typography component="span">{item.name}</Typography>
                    <Typography component="span" sx={{ color: "#71806a" }}>{item.price ? `฿${item.price}` : "ของแถม"}</Typography>
                  </Stack>
                ))}
              </Stack>
              <Stack direction="row" spacing={1.25} alignItems="baseline" sx={{ mt: 2.5 }}>
                <Typography sx={{ color: "#8b8b81", textDecoration: "line-through" }}>
                  ฿{selected.originalPrice}
                </Typography>
                <Typography sx={{ color: "#a8874b", fontSize: 25, fontWeight: 700 }}>
                  ฿{selected.price}
                </Typography>
                <Typography sx={{ color: "#547d3b", fontSize: 14 }}>
                  ประหยัด ฿{Number(selected.originalPrice.replace(/,/g, "")) - Number(selected.price.replace(/,/g, ""))}
                </Typography>
              </Stack>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setSelected(null)} color="inherit">
            ปิด
          </Button>
          <Button
            onClick={() => {
              onAdd({ ...selected, size: "Gift set" });
              setSelected(null);
            }}
            variant="contained"
            disableElevation
          >
            เพิ่มลงตะกร้า
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={imageOpen} onClose={() => setImageOpen(false)} maxWidth="md" fullWidth>
        {selected && <Box component="img" src={assetUrl(selected.image)} alt={`${selected.name} ขนาดใหญ่`} sx={{ width: "100%", maxHeight: "82vh", objectFit: "contain", display: "block", bgcolor: "#183b2a" }} />}
      </Dialog>
    </>
  );
}
