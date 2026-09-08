import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function LoginPage({ customer, onBack, onLogin, onRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const submit = (event) => {
    event.preventDefault();
    if (!onLogin({ username, password }))
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
  };
  return (
    <Box
      component="main"
      sx={{
        minHeight: "72vh",
        bgcolor: "#eee9dd",
        display: "grid",
        placeItems: "center",
        px: 2,
        py: 5,
      }}
    >
      <Box
        component="form"
        onSubmit={submit}
        sx={{
          width: "100%",
          maxWidth: 460,
          bgcolor: "#fffdf9",
          p: { xs: 3, md: 5 },
          boxShadow: "0 18px 50px rgba(31,52,37,.1)",
        }}
      >
        <Button onClick={onBack} sx={{ color: "#183b2a", px: 0, mb: 2 }}>
          ← กลับหน้าหลัก
        </Button>
        <Typography
          sx={{
            color: "#a8874b",
            fontSize: 13,
            letterSpacing: ".15em",
            fontWeight: 700,
          }}
        >
          MATCHA MORI MEMBER
        </Typography>
        <Typography variant="h1" sx={{ fontSize: { xs: 35, md: 43 }, mt: 1 }}>
          เข้าสู่ระบบ
        </Typography>
        <Typography sx={{ color: "#607159", mt: 1 }}>
          เข้าสู่บัญชีเพื่อดูข้อมูลสมาชิกและประวัติการสั่งซื้อ
        </Typography>
        <Stack spacing={2} sx={{ mt: 3 }}>
          <TextField
            required
            label="ชื่อผู้ใช้"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
          />
          <TextField
            required
            type="password"
            label="รหัสผ่าน"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
          {error && (
            <Typography sx={{ color: "#a34c3b", fontSize: 14 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            disableElevation
            fullWidth
            sx={{ py: 1.4 }}
          >
            เข้าสู่ระบบ
          </Button>
        </Stack>
        <Typography sx={{ color: "#607159", textAlign: "center", mt: 3 }}>
          ยังไม่มีบัญชี?
        </Typography>
        <Button onClick={onRegister} fullWidth sx={{ mt: 0.5 }}>
          สมัครสมาชิก Matcha Mori
        </Button>
        {customer && (
          <Typography
            sx={{ color: "#607159", fontSize: 13, textAlign: "center", mt: 1 }}
          >
            กรุณาเข้าสู่ระบบด้วยชื่อผู้ใช้ที่สมัครไว้
          </Typography>
        )}
      </Box>
    </Box>
  );
}
