import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

const priceOf = (price) => Number(String(price).replace(/,/g, ""));

export default function CheckoutPage({
  cart,
  customer,
  couponApplied,
  onBack,
  onConfirm,
}) {
  const [method, setMethod] = useState("transfer");
  const [slipName, setSlipName] = useState("");
  const subtotal = cart.reduce(
    (sum, item) => sum + priceOf(item.price) * item.quantity,
    0,
  );
  const discount = couponApplied ? Math.round(subtotal * 0.12) : 0;
  const total = subtotal - discount;
  return (
    <Box
      component="main"
      sx={{
        minHeight: "75vh",
        bgcolor: "#eee9dd",
        px: { xs: 2.5, md: "10vw" },
        py: { xs: 4, md: 7 },
      }}
    >
      <Button onClick={onBack} sx={{ color: "#183b2a", px: 0, mb: 3 }}>
        ← กลับไปตะกร้าสินค้า
      </Button>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.25fr .75fr" },
          gap: 3,
          maxWidth: 1100,
          mx: "auto",
        }}
      >
        <Box sx={{ bgcolor: "#fffdf9", p: { xs: 3, md: 5 } }}>
          <Typography variant="h1" sx={{ fontSize: { xs: 38, md: 48 } }}>
            ชำระเงิน
          </Typography>
          <Typography sx={{ color: "#607159", mt: 1 }}>
            ตรวจสอบข้อมูลจัดส่งและเลือกวิธีชำระเงิน
          </Typography>
          <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #dcd3c2" }}>
            <Typography sx={{ fontSize: 21, fontWeight: 700 }}>
              ข้อมูลจัดส่ง
            </Typography>
            <Typography sx={{ mt: 1, fontWeight: 700 }}>
              {customer.name}
            </Typography>
            <Typography sx={{ color: "#607159" }}>
              {customer.phone} · {customer.email}
            </Typography>
            <Typography sx={{ color: "#607159", mt: 0.4 }}>
              {customer.address || "ยังไม่ได้ระบุที่อยู่"}
            </Typography>
          </Box>
          <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #dcd3c2" }}>
            <Typography sx={{ fontSize: 21, fontWeight: 700 }}>
              วิธีชำระเงิน
            </Typography>
            <RadioGroup
              value={method}
              onChange={(event) => setMethod(event.target.value)}
              sx={{ mt: 1 }}
            >
              <FormControlLabel
                value="transfer"
                control={<Radio />}
                label="สแกน QR พร้อมเพย์ / แนบสลิป"
              />
              <FormControlLabel
                value="card"
                control={<Radio />}
                label="บัตรเครดิต / เดบิต"
              />
            </RadioGroup>
            {method === "transfer" ? (
              <Box sx={{ mt: 1, p: 2.5, bgcolor: "#eef1df", color: "#415444" }}>
                <Typography sx={{ fontWeight: 700 }}>QR พร้อมเพย์</Typography>
                <Typography sx={{ fontSize: 15, mt: 0.5 }}>
                  โปรดตั้งค่าหมายเลขพร้อมเพย์ร้านเพื่อใช้งาน QR จริง
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  sx={{ mt: 2, color: "#183b2a", borderColor: "#547d3b" }}
                >
                  แนบสลิปโอนเงิน
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(event) =>
                      setSlipName(event.target.files?.[0]?.name || "")
                    }
                  />
                </Button>
                {slipName && (
                  <Typography sx={{ mt: 1, fontSize: 14, color: "#547d3b" }}>
                    แนบไฟล์แล้ว: {slipName}
                  </Typography>
                )}
              </Box>
            ) : (
              <Stack spacing={1.5} sx={{ mt: 1 }}>
                <TextField
                  label="หมายเลขบัตร"
                  placeholder="0000 0000 0000 0000"
                />
                <Stack direction="row" spacing={1.5}>
                  <TextField label="วันหมดอายุ" placeholder="MM/YY" fullWidth />
                  <TextField label="CVV" placeholder="123" fullWidth />
                </Stack>
              </Stack>
            )}
          </Box>
          <Button
            disabled={method === "transfer" && !slipName}
            onClick={() => onConfirm({ total, discount, method, slipName })}
            variant="contained"
            disableElevation
            fullWidth
            sx={{ mt: 4, py: 1.5, fontSize: 17 }}
          >
            ยืนยันและชำระ ฿{total}
          </Button>
        </Box>
        <Box
          sx={{
            bgcolor: "#183b2a",
            color: "#fffdf9",
            p: { xs: 3, md: 4 },
            alignSelf: "start",
          }}
        >
          <Typography
            sx={{
              color: "#d6dfac",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: ".14em",
            }}
          >
            ORDER SUMMARY
          </Typography>
          <Stack spacing={1.5} sx={{ mt: 2.5 }}>
            {cart.map((item) => (
              <Stack
                key={item.name}
                direction="row"
                justifyContent="space-between"
                gap={2}
              >
                <Typography>
                  {item.name} × {item.quantity}
                </Typography>
                <Typography>฿{priceOf(item.price) * item.quantity}</Typography>
              </Stack>
            ))}
          </Stack>
          <Box
            sx={{ mt: 3, pt: 2, borderTop: "1px solid rgba(255,255,255,.25)" }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Typography>ยอดสินค้า</Typography>
              <Typography>฿{subtotal}</Typography>
            </Stack>
            {discount > 0 && (
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mt: 1, color: "#d6dfac" }}
              >
                <Typography>ส่วนลด 12%</Typography>
                <Typography>-฿{discount}</Typography>
              </Stack>
            )}
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{ mt: 2, fontSize: 20, fontWeight: 700 }}
            >
              <Typography>ยอดสุทธิ</Typography>
              <Typography sx={{ color: "#f1e4c2" }}>฿{total}</Typography>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
