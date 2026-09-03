import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { assetUrl } from "../utils/assets";

const priceOf = (price) => Number(String(price).replace(/,/g, ""));
const formatPrice = (price) => price.toLocaleString("en-US");
const packPricing = (pack, matcha) => {
  const original = pack.accessoryPrice + priceOf(matcha.price);
  const price = Math.round((original * (1 - pack.discountRate)) / 10) * 10;
  return { original, price };
};

export default function PackageCollection({ packages, products, onAdd }) {
  const [selected, setSelected] = useState(null);
  const [selectedMatcha, setSelectedMatcha] = useState(null);
  const [imageOpen, setImageOpen] = useState(false);
  const openPackage = (pack) => {
    setSelected(pack);
    setSelectedMatcha(
      products.find((product) => product.name === pack.defaultMatcha) ||
        products[0],
    );
  };
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
                  <Button
                    onClick={() => openPackage(pack)}
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
          {selected && selectedMatcha && (
            <>
              <Button
                onClick={() => setImageOpen(true)}
                aria-label={`เปิดรูป ${selected.name} ขนาดใหญ่`}
                sx={{
                  display: "block",
                  p: 0,
                  minWidth: 0,
                  width: "100%",
                  mb: 2,
                }}
              >
                <Box
                  component="img"
                  src={assetUrl(selected.image)}
                  alt={selected.name}
                  sx={{
                    width: "100%",
                    height: 210,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Button>
              <Typography sx={{ color: "#607159", fontSize: 17 }}>
                {selected.description}
              </Typography>
              <TextField
                select
                fullWidth
                label="เลือกมัทฉะในแพ็ก"
                value={selectedMatcha.name}
                onChange={(event) =>
                  setSelectedMatcha(
                    products.find(
                      (product) => product.name === event.target.value,
                    ),
                  )
                }
                sx={{ mt: 2.5 }}
              >
                {products.map((product) => (
                  <MenuItem key={product.name} value={product.name}>
                    {product.name} · {product.size} · ฿{product.price}
                  </MenuItem>
                ))}
              </TextField>
              <Typography sx={{ color: "#547d3b", fontSize: 14, mt: 1 }}>
                ราคาชุดจะปรับตามมัทฉะที่เลือก โดยยังคงส่วนลดแพ็กเกจ
              </Typography>
              <Typography sx={{ mt: 2.5, fontWeight: 700, fontSize: 18 }}>
                ภายในแพ็กประกอบด้วย
              </Typography>
              <Stack component="ul" spacing={0.7} sx={{ pl: 2.5, mt: 1 }}>
                {selected.items.map((item) => {
                  const listedItem = item.isMatcha
                    ? {
                        ...selectedMatcha,
                        price: priceOf(selectedMatcha.price),
                      }
                    : item;
                  return (
                    <Stack
                      component="li"
                      key={item.name}
                      direction="row"
                      justifyContent="space-between"
                      sx={{ color: "#415444", pr: 1 }}
                    >
                      <Typography component="span">
                        {listedItem.name}
                      </Typography>
                      <Typography component="span" sx={{ color: "#71806a" }}>
                        {listedItem.price
                          ? `฿${formatPrice(priceOf(listedItem.price))}`
                          : "ของแถม"}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
              <Stack
                direction="row"
                spacing={1.25}
                alignItems="baseline"
                sx={{ mt: 2.5 }}
              >
                <Typography
                  sx={{ color: "#8b8b81", textDecoration: "line-through" }}
                >
                  ฿{formatPrice(packPricing(selected, selectedMatcha).original)}
                </Typography>
                <Typography
                  sx={{ color: "#a8874b", fontSize: 25, fontWeight: 700 }}
                >
                  ฿{formatPrice(packPricing(selected, selectedMatcha).price)}
                </Typography>
                <Typography sx={{ color: "#547d3b", fontSize: 14 }}>
                  ประหยัด ฿
                  {formatPrice(
                    packPricing(selected, selectedMatcha).original -
                      packPricing(selected, selectedMatcha).price,
                  )}
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
              const pricing = packPricing(selected, selectedMatcha);
              onAdd({
                ...selected,
                name: `${selected.name} · ${selectedMatcha.name}`,
                price: formatPrice(pricing.price),
                size: "Gift set",
                selectedMatcha: selectedMatcha.name,
              });
              setSelected(null);
            }}
            variant="contained"
            disableElevation
          >
            เพิ่มลงตะกร้า
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={imageOpen}
        onClose={() => setImageOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selected && (
          <Box
            component="img"
            src={assetUrl(selected.image)}
            alt={`${selected.name} ขนาดใหญ่`}
            sx={{
              width: "100%",
              maxHeight: "82vh",
              objectFit: "contain",
              display: "block",
              bgcolor: "#183b2a",
            }}
          />
        )}
      </Dialog>
    </>
  );
}
