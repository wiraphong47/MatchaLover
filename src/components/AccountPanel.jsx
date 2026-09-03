import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
export default function AccountPanel({
  open,
  onClose,
  customer,
  orders,
  onEdit,
  onLogout,
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontFamily: "Pridi, serif", fontSize: 30 }}>
        บัญชีของฉัน
      </DialogTitle>
      <DialogContent>
        {customer && (
          <>
            <Box sx={{ p: 2, bgcolor: "#eef1df" }}>
              <Typography sx={{ fontWeight: 700, fontSize: 19 }}>
                {customer.name}
              </Typography>
              <Typography>
                {customer.email} · {customer.phone}
              </Typography>
              <Typography sx={{ mt: 0.5, color: "#607159" }}>
                {customer.address || "ยังไม่ได้ระบุที่อยู่"}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button onClick={onEdit} sx={{ mt: 1 }}>
                แก้ไขข้อมูล
              </Button>
              <Button onClick={onLogout} color="inherit" sx={{ mt: 1 }}>
                ออกจากระบบ
              </Button>
            </Stack>
            <Divider sx={{ my: 2 }} />
            <Typography sx={{ fontFamily: "Pridi, serif", fontSize: 25 }}>
              ประวัติการสั่งซื้อ
            </Typography>
            {orders.length ? (
              <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                {orders.map((order) => (
                  <Box
                    key={order.id}
                    sx={{ border: "1px solid #ded6c6", p: 1.8 }}
                  >
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ fontWeight: 700 }}>
                        #{order.id}
                      </Typography>
                      <Typography sx={{ color: "#547d3b" }}>
                        ยืนยันคำสั่งซื้อแล้ว
                      </Typography>
                    </Stack>
                    <Typography sx={{ color: "#607159", mt: 0.5 }}>
                      {order.items
                        .map((item) => `${item.name} × ${item.quantity}`)
                        .join(", ")}
                    </Typography>
                    <Typography sx={{ mt: 0.5, fontWeight: 700 }}>
                      รวม ฿{order.total}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            ) : (
              <Typography sx={{ color: "#607159", mt: 1 }}>
                ยังไม่มีประวัติการสั่งซื้อ
              </Typography>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
