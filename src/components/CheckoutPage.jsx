import {
  Alert,
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
  busy = false,
  error = "",
  onBack,
  onConfirm,
}) {
  const [method, setMethod] = useState("promptpay");
  const [slipFile, setSlipFile] = useState(null);
  const [recipientName, setRecipientName] = useState(customer?.name || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [address, setAddress] = useState(customer?.address || "");
  const [postalCode, setPostalCode] = useState(customer?.postalCode || "");
  const [editingAddress, setEditingAddress] = useState(!customer?.address);

  const subtotal = cart.reduce(
    (sum, item) => sum + priceOf(item.price) * item.quantity,
    0
  );
  const discount = couponApplied ? Math.round(subtotal * 0.12) : 0;
  const total = subtotal - discount;

  const handleConfirmOrder = () => {
    onConfirm({
      method,
      slipFile,
      shippingAddress: {
        recipientName: recipientName.trim() || customer?.name || "",
        phone: phone.trim() || customer?.phone || "",
        address: address.trim(),
        postalCode: postalCode.trim(),
      },
    });
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "75vh",
        bgcolor: "#eee9dd",
        px: { xs: 1.5, sm: 2.5, md: "10vw" },
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
        <Box sx={{ bgcolor: "#fffdf9", p: { xs: 2.5, sm: 3, md: 5 } }}>
          <Typography variant="h1" sx={{ fontSize: { xs: 34, md: 48 } }}>
            ชำระเงิน
          </Typography>
          <Typography sx={{ color: "#607159", mt: 1 }}>
            ตรวจสอบข้อมูลจัดส่งและเลือกวิธีชำระเงิน
          </Typography>
          <Box sx={{ mt: 4, pt: 3, borderTop: "1px solid #dcd3c2" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography sx={{ fontSize: 21, fontWeight: 700 }}>
                ข้อมูลจัดส่ง
              </Typography>
              {customer?.address && !editingAddress && (
                <Button
                  size="small"
                  onClick={() => setEditingAddress(true)}
                  sx={{ color: "#315d3f", fontWeight: 700 }}
                >
                  แก้ไขที่อยู่
                </Button>
              )}
            </Stack>

            {editingAddress ? (
              <Stack spacing={1.8} sx={{ mt: 2 }}>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 1.5,
                  }}
                >
                  <TextField
                    size="small"
                    label="ชื่อผู้รับ"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    required
                  />
                  <TextField
                    size="small"
                    label="เบอร์โทรศัพท์"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </Box>
                <TextField
                  size="small"
                  label="ที่อยู่จัดส่ง (บ้านเลขที่ หมู่บ้าน ซอย ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  multiline
                  minRows={2}
                  required
                  placeholder="เช่น 123/45 ซอยสุขุมวิท 55 แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพฯ"
                />
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 1.5,
                    alignItems: "center",
                  }}
                >
                  <TextField
                    size="small"
                    label="รหัสไปรษณีย์"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="เช่น 10110"
                  />
                  {customer?.address && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setEditingAddress(false)}
                      disabled={!address.trim()}
                      sx={{
                        color: "#315d3f",
                        borderColor: "#78976b",
                        height: 40,
                      }}
                    >
                      ใช้ที่อยู่นี้
                    </Button>
                  )}
                </Box>
              </Stack>
            ) : (
              <Box sx={{ mt: 1 }}>
                <Typography sx={{ fontWeight: 700 }}>
                  {recipientName}
                </Typography>
                <Typography sx={{ color: "#607159" }}>
                  {phone} · {customer.email}
                </Typography>
                <Typography sx={{ color: "#607159", mt: 0.4 }}>
                  {address}
                  {postalCode ? ` ${postalCode}` : ""}
                </Typography>
              </Box>
            )}
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
                value="promptpay"
                control={<Radio />}
                label="สแกน QR พร้อมเพย์ / แนบสลิป"
              />
              <FormControlLabel
                value="bank_transfer"
                control={<Radio />}
                label="โอนผ่านบัญชีธนาคาร / แนบสลิป"
              />
            </RadioGroup>
            <Box sx={{ mt: 1, p: 2.5, bgcolor: "#eef1df", color: "#415444" }}>
              <Typography sx={{ fontWeight: 700 }}>
                {method === "promptpay"
                  ? "QR พร้อมเพย์"
                  : "บัญชีธนาคาร Matcha Mori"}
              </Typography>
              <Typography sx={{ fontSize: 15, mt: 0.5 }}>
                {method === "promptpay"
                  ? "ชำระผ่านพร้อมเพย์ของร้าน แล้วเลือกไฟล์หลักฐานการโอน"
                  : "โอนเข้าบัญชีของร้าน แล้วเลือกไฟล์หลักฐานการโอน"}
              </Typography>
              <Button
                component="label"
                variant="outlined"
                disabled={busy}
                sx={{ mt: 2, color: "#183b2a", borderColor: "#547d3b" }}
              >
                เลือกไฟล์สลิป
                <input
                  hidden
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  type="file"
                  onChange={(event) =>
                    setSlipFile(event.target.files?.[0] || null)
                  }
                />
              </Button>
              {slipFile && (
                <Typography sx={{ mt: 1, fontSize: 14, color: "#547d3b" }}>
                  เลือกไฟล์แล้ว: {slipFile.name}
                </Typography>
              )}
              <Typography sx={{ mt: 1.5, fontSize: 13, color: "#607159" }}>
                หลังยืนยัน ระบบจะรับคำสั่งซื้อไว้ในสถานะรอตรวจสอบการชำระเงิน
              </Typography>
            </Box>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
          {!address.trim() && (
            <Typography sx={{ mt: 2, fontSize: 14, color: "#a84e32" }}>
              * กรุณาระบุที่อยู่จัดส่งให้ครบถ้วนก่อนยืนยันคำสั่งซื้อ
            </Typography>
          )}
          <Button
            disabled={busy || !slipFile || !cart.length || !address.trim()}
            onClick={handleConfirmOrder}
            variant="contained"
            disableElevation
            fullWidth
            sx={{ mt: 3, py: 1.5, fontSize: 17 }}
          >
            {busy ? "กำลังบันทึกคำสั่งซื้อ…" : `ยืนยันคำสั่งซื้อ ฿${total}`}
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
                gap={1.5}
                alignItems="flex-start"
              >
                <Typography
                  sx={{ flex: 1, minWidth: 0, overflowWrap: "anywhere" }}
                >
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
