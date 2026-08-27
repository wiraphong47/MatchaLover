import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function CartDrawer({
  open,
  onClose,
  cart,
  onChangeQuantity,
  onCheckout,
  customer,
  onOpenAccount,
  couponCode,
  onCouponChange,
  couponApplied,
}) {
  const priceOf = (price) => Number(String(price).replace(/,/g, ""));
  const subtotal = cart.reduce(
    (sum, item) => sum + priceOf(item.price) * item.quantity,
    0,
  );
  const discount = couponApplied ? Math.round(subtotal * 0.12) : 0;
  const total = subtotal - discount;
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: "100%", sm: 430 }, bgcolor: "#fffdf9" },
      }}
    >
      <Stack sx={{ height: "100%", p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h5"
            sx={{ fontFamily: "Pridi, serif", fontSize: 32 }}
          >
            ตะกร้าสินค้า
          </Typography>
          <IconButton onClick={onClose}>×</IconButton>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={2} sx={{ flex: 1 }}>
          {cart.length === 0 ? (
            <Typography sx={{ color: "#607159" }}>
              ยังไม่มีสินค้าในตะกร้า
            </Typography>
          ) : (
            cart.map((item) => (
              <Box
                key={item.name}
                sx={{ pb: 2, borderBottom: "1px solid #e1dacb" }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                  {item.name}
                </Typography>
                <Typography sx={{ color: "#607159" }}>
                  {item.size} · ฿{item.price}
                </Typography>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 1 }}
                >
                  <Stack direction="row" alignItems="center">
                    <Button onClick={() => onChangeQuantity(item.name, -1)}>
                      -
                    </Button>
                    <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                    <Button onClick={() => onChangeQuantity(item.name, 1)}>
                      +
                    </Button>
                  </Stack>
                  <Typography sx={{ fontWeight: 700 }}>
                    ฿{priceOf(item.price) * item.quantity}
                  </Typography>
                </Stack>
              </Box>
            ))
          )}
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ p: 1.8, bgcolor: "#eef1df" }}>
          <Typography sx={{ color: "#547d3b", fontWeight: 700, fontSize: 14 }}>
            รับส่วนลด 12% ด้วยโค้ด MATCHA12
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <TextField value={couponCode} onChange={(event) => onCouponChange(event.target.value)} placeholder="กรอกโค้ดส่วนลด" size="small" fullWidth />
            <Button variant="outlined" sx={{ whiteSpace: "nowrap" }}>ใช้โค้ด</Button>
          </Stack>
          {couponCode && <Typography sx={{ mt: .8, fontSize: 13, color: couponApplied ? "#547d3b" : "#a34c3b" }}>{couponApplied ? "ใช้คูปองสำเร็จ ลด 12%" : "รหัสคูปองไม่ถูกต้อง"}</Typography>}
        </Box>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
          <Typography>ยอดสินค้า</Typography><Typography>฿{subtotal}</Typography>
        </Stack>
        {couponApplied && <Stack direction="row" justifyContent="space-between" sx={{ mt: .7, color: "#547d3b" }}><Typography>ส่วนลด 12%</Typography><Typography>-฿{discount}</Typography></Stack>}
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.2 }}>
          <Typography sx={{ fontWeight: 700 }}>ยอดสุทธิ</Typography>
          <Typography sx={{ fontSize: 23, fontWeight: 700, color: "#a8874b" }}>฿{total}</Typography>
        </Stack>
        {!customer && (
          <Box sx={{ mt: 2, p: 1.8, bgcolor: "#eef1df" }}>
            <Typography sx={{ fontSize: 15 }}>
              สมัครสมาชิกก่อนชำระเงิน เพื่อบันทึกการจัดส่งและประวัติคำสั่งซื้อ
            </Typography>
            <Button onClick={onOpenAccount} sx={{ px: 0, mt: 0.5 }}>
              กรอกข้อมูลสมาชิก →
            </Button>
          </Box>
        )}
        <Button
          disabled={!cart.length}
          onClick={onCheckout}
          variant="contained"
          disableElevation
          fullWidth
          sx={{ mt: 2, py: 1.4 }}
        >
          ยืนยันคำสั่งซื้อ
        </Button>
      </Stack>
    </Drawer>
  );
}
