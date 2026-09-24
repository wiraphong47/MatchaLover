import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  formatOrderDate,
  money,
  orderStatusLabels,
  paymentMethodLabels,
  paymentStatusLabels,
} from "../utils/order";

const detailRow = (label, value, emphasized = false) => (
  <Stack
    key={label}
    direction="row"
    justifyContent="space-between"
    alignItems="baseline"
    gap={2}
  >
    <Typography sx={{ color: "#667465" }}>{label}</Typography>
    <Typography
      sx={{
        color: emphasized ? "#a47736" : "#203c2a",
        fontSize: emphasized ? 22 : 16,
        fontWeight: emphasized ? 800 : 600,
        textAlign: "right",
      }}
    >
      {value}
    </Typography>
  </Stack>
);

export default function OrderSummaryPage({
  order,
  onContinue,
  onViewOrders,
  onResendEmail,
}) {
  const [resending, setResending] = useState(false);
  const [resendResult, setResendResult] = useState(null);

  if (!order) {
    return (
      <Box component="main" sx={{ bgcolor: "#eee9dd", px: 2, py: 8 }}>
        <Box
          sx={{
            maxWidth: 720,
            mx: "auto",
            bgcolor: "#fffdf8",
            p: 4,
            borderRadius: 3,
          }}
        >
          <Alert severity="warning">ไม่พบข้อมูลคำสั่งซื้อล่าสุด</Alert>
          <Button
            onClick={onContinue}
            variant="contained"
            sx={{ mt: 3, bgcolor: "#173b2a" }}
          >
            กลับไปเลือกสินค้า
          </Button>
        </Box>
      </Box>
    );
  }

  const shipping = order.shippingAddress || {};
  const status = orderStatusLabels[order.status] || order.status;
  const paymentMethod =
    order.paymentMethodLabel ||
    paymentMethodLabels[order.paymentMethod] ||
    "ไม่ระบุ";
  const paymentStatus =
    order.paymentStatusLabel ||
    paymentStatusLabels[order.paymentStatus] ||
    "รอตรวจสอบ";

  const handleResend = async () => {
    if (!onResendEmail || resending) return;
    setResending(true);
    setResendResult(null);
    try {
      const res = await onResendEmail(order.id);
      setResendResult({
        severity: res?.emailSent === true ? "success" : "info",
        text:
          res?.message ||
          `ส่งสรุปคำสั่งซื้อไปยังอีเมล ${order.customerEmail} เรียบร้อยแล้ว`,
      });
    } catch (err) {
      setResendResult({
        severity: "error",
        text: err.message || "ส่งอีเมลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setResending(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "75vh",
        bgcolor: "#eee9dd",
        px: { xs: 1.5, sm: 2.5, md: "8vw" },
        py: { xs: 4, md: 7 },
        "@media print": {
          bgcolor: "#fff",
          p: 0,
        },
      }}
    >
      <Box sx={{ maxWidth: 1080, mx: "auto" }}>
        {/* Card Header */}
        <Box
          sx={{
            bgcolor: "#173b2a",
            color: "#fffdf8",
            borderRadius: { xs: "22px 22px 0 0", md: "32px 32px 0 0" },
            p: { xs: 3, sm: 4, md: 5 },
            position: "relative",
            overflow: "hidden",
            "&::after": {
              content: '""',
              position: "absolute",
              width: 320,
              height: 320,
              borderRadius: "50%",
              bgcolor: "rgba(215, 230, 169, 0.06)",
              top: -140,
              right: -80,
              pointerEvents: "none",
            },
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ sm: "center" }}
            gap={2.5}
          >
            <Stack direction="row" alignItems="center" gap={2}>
              <CheckCircleOutlineRoundedIcon
                aria-hidden="true"
                sx={{ color: "#d7e6a9", fontSize: { xs: 48, sm: 60 } }}
              />
              <Box>
                <Typography
                  sx={{
                    color: "#d7e6a9",
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: ".16em",
                  }}
                >
                  ORDER RECEIVED
                </Typography>
                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: 28, sm: 38 },
                    fontWeight: 800,
                    fontFamily: "Pridi, serif",
                    letterSpacing: "-0.01em",
                  }}
                >
                  รับคำสั่งซื้อแล้ว
                </Typography>
              </Box>
            </Stack>
            <Box sx={{ textAlign: { sm: "right" } }}>
              <Typography sx={{ color: "#bfd0bf", fontSize: 13 }}>
                เลขคำสั่งซื้อ
              </Typography>
              <Typography
                sx={{
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: ".05em",
                  color: "#f6f2e8",
                }}
              >
                {order.orderNumber || order.id}
              </Typography>
              <Typography sx={{ color: "#bfd0bf", fontSize: 14, mt: 0.4 }}>
                {order.createdAtLabel || formatOrderDate(order.createdAt)}
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Card Body */}
        <Box
          sx={{
            bgcolor: "#fffdf8",
            borderRadius: { xs: "0 0 22px 22px", md: "0 0 32px 32px" },
            p: { xs: 2.5, sm: 4, md: 5 },
            boxShadow: "0 18px 45px rgba(31,52,37,.09)",
          }}
        >
          {/* Email notifications */}
          <Alert severity="info" sx={{ mb: 2.5 }}>
            คำสั่งซื้อถูกบันทึกแล้วและอยู่ในสถานะ “{status}”
            ร้านค้าจะจัดส่งสินค้าหลังตรวจสอบหลักฐานการชำระเงินเรียบร้อยแล้ว
          </Alert>

          {order.emailSent === true && (
            <Alert
              severity="success"
              icon={<EmailOutlinedIcon />}
              sx={{ mb: 2.5 }}
            >
              ส่งสรุปคำสั่งซื้อไปยังอีเมล <strong>{order.customerEmail}</strong>{" "}
              แล้ว กรุณาตรวจสอบกล่องจดหมายของคุณ
            </Alert>
          )}

          {order.emailSent === false && (
            <Alert severity="warning" sx={{ mb: 2.5 }}>
              บันทึกคำสั่งซื้อเรียบร้อยแล้ว แต่การส่งอีเมลไปยัง{" "}
              {order.customerEmail} ยังไม่สำเร็จ คุณสามารถกดปุ่ม
              "ส่งอีเมลสรุปอีกครั้ง" ด้านล่างได้ตลอดเวลา
            </Alert>
          )}

          {order.emailSent == null && order.customerEmail && (
            <Alert
              severity="success"
              icon={<EmailOutlinedIcon />}
              sx={{ mb: 2.5 }}
            >
              คำสั่งซื้อบันทึกเรียบร้อยแล้ว และผูกกับอีเมล {order.customerEmail}
            </Alert>
          )}

          {resendResult && (
            <Alert
              severity={resendResult.severity}
              onClose={() => setResendResult(null)}
              sx={{ mb: 2.5 }}
            >
              {resendResult.text}
            </Alert>
          )}

          {/* Action Quick Bar */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{
              mb: 4,
              pb: 3,
              borderBottom: "1px solid #e7e2d4",
              "@media print": { display: "none" },
            }}
          >
            {onResendEmail && order.customerEmail && (
              <Button
                variant="outlined"
                size="small"
                startIcon={
                  resending ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <EmailOutlinedIcon />
                  )
                }
                onClick={handleResend}
                disabled={resending}
                sx={{
                  color: "#315d3f",
                  borderColor: "#78976b",
                  "&:hover": {
                    borderColor: "#315d3f",
                    bgcolor: "rgba(49,93,63,0.06)",
                  },
                }}
              >
                {resending
                  ? "กำลังส่งอีเมล…"
                  : "ส่งสรุปคำสั่งซื้อไปที่อีเมลอีกครั้ง"}
              </Button>
            )}
            <Button
              variant="text"
              size="small"
              startIcon={<PrintOutlinedIcon />}
              onClick={handlePrint}
              sx={{ color: "#546552" }}
            >
              พิมพ์ / บันทึกใบสรุปคำสั่งซื้อ
            </Button>
          </Stack>

          {/* Details Grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.35fr .65fr" },
              gap: { xs: 4, md: 5 },
            }}
          >
            {/* Products Column */}
            <Box>
              <Typography
                component="h2"
                sx={{ fontSize: 22, fontWeight: 800, color: "#183b2a" }}
              >
                รายการสินค้าที่สั่งซื้อ
              </Typography>
              <Stack divider={<Divider flexItem />} sx={{ mt: 1.5 }}>
                {(order.items || []).map((item, index) => (
                  <Stack
                    key={`${item.productId || item.name}-${index}`}
                    direction="row"
                    justifyContent="space-between"
                    gap={2}
                    sx={{ py: 2 }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ color: "#203c2a", fontWeight: 700 }}>
                        {item.name}
                      </Typography>
                      {item.options?.selectedMatcha &&
                        !item.name.includes(item.options.selectedMatcha) && (
                          <Typography sx={{ color: "#718070", fontSize: 14 }}>
                            มัทฉะในชุด: {item.options.selectedMatcha}
                          </Typography>
                        )}
                      <Typography sx={{ color: "#718070", fontSize: 14 }}>
                        {money(item.unitPrice)} × {item.quantity}
                      </Typography>
                    </Box>
                    <Typography sx={{ color: "#203c2a", fontWeight: 800 }}>
                      {money(item.lineTotal)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={1.2}>
                {detailRow("ยอดรวมสินค้า", money(order.subtotal))}
                {Number(order.discount) > 0 &&
                  detailRow(
                    `ส่วนลดพิเศษ${order.couponCode ? ` (${order.couponCode})` : ""}`,
                    `-${money(order.discount)}`
                  )}
                {detailRow(
                  "ค่าจัดส่ง",
                  Number(order.shippingFee) > 0
                    ? money(order.shippingFee)
                    : "จัดส่งฟรี"
                )}
                <Divider sx={{ my: 0.5 }} />
                {detailRow("ยอดสุทธิ", money(order.total), true)}
              </Stack>
            </Box>

            {/* Sidebar Column: Status, Payment, Shipping */}
            <Stack spacing={2.5}>
              <Box
                sx={{
                  p: 2.5,
                  bgcolor: "#f4f0e5",
                  borderRadius: 3,
                  border: "1px solid #e5dfd2",
                }}
              >
                <Typography
                  sx={{ color: "#6d796c", fontSize: 13, fontWeight: 700 }}
                >
                  สถานะคำสั่งซื้อ
                </Typography>
                <Chip
                  label={status}
                  sx={{
                    mt: 1,
                    bgcolor: "#e3ebcf",
                    color: "#31563a",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                />
                <Divider sx={{ my: 2 }} />
                <Typography
                  sx={{ color: "#6d796c", fontSize: 13, fontWeight: 700 }}
                >
                  การชำระเงิน
                </Typography>
                <Typography sx={{ mt: 0.5, fontWeight: 700, color: "#183b2a" }}>
                  {paymentMethod}
                </Typography>
                <Typography sx={{ color: "#6d796c", fontSize: 14 }}>
                  สถานะ: {paymentStatus}
                </Typography>
                {order.slipName && (
                  <Typography sx={{ color: "#547d3b", fontSize: 13, mt: 0.5 }}>
                    หลักฐาน: {order.slipName}
                  </Typography>
                )}
              </Box>

              <Box
                sx={{
                  p: 2.5,
                  bgcolor: "#fff",
                  border: "1px solid #ded8ca",
                  borderRadius: 3,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 800,
                    mb: 1.2,
                    color: "#183b2a",
                    fontSize: 16,
                  }}
                >
                  ที่อยู่สำหรับจัดส่ง
                </Typography>
                <Typography sx={{ fontWeight: 700, color: "#222" }}>
                  {shipping.recipientName || order.customerName}
                </Typography>
                <Typography sx={{ color: "#617060", fontSize: 14 }}>
                  {shipping.phone}
                </Typography>
                <Typography
                  sx={{
                    color: "#617060",
                    mt: 0.8,
                    fontSize: 14.5,
                    lineHeight: 1.6,
                    whiteSpace: "pre-line",
                  }}
                >
                  {shipping.address}
                  {shipping.postalCode ? ` ${shipping.postalCode}` : ""}
                </Typography>
                {order.customerEmail && (
                  <Typography
                    sx={{
                      color: "#788775",
                      fontSize: 13,
                      mt: 1.5,
                      pt: 1,
                      borderTop: "1px dashed #ded8ca",
                    }}
                  >
                    อีเมลติดต่อ: {order.customerEmail}
                  </Typography>
                )}
              </Box>
            </Stack>
          </Box>

          {/* Navigation Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="center"
            spacing={2}
            sx={{ mt: 6, "@media print": { display: "none" } }}
          >
            <Button
              onClick={onViewOrders}
              variant="outlined"
              size="large"
              startIcon={<ReceiptLongOutlinedIcon />}
              sx={{
                color: "#173b2a",
                borderColor: "#78976b",
                px: 3,
                py: 1.3,
                borderRadius: 99,
                fontWeight: 700,
              }}
            >
              ดูประวัติคำสั่งซื้อ
            </Button>
            <Button
              onClick={onContinue}
              variant="contained"
              size="large"
              disableElevation
              startIcon={<ShoppingBagOutlinedIcon />}
              sx={{
                bgcolor: "#315d3f",
                "&:hover": { bgcolor: "#244b32" },
                px: 3.5,
                py: 1.3,
                borderRadius: 99,
                fontWeight: 700,
              }}
            >
              เลือกสินค้าต่อ
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
