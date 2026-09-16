import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { interestGroups } from "../utils/matchaInterests";
import { preferenceLabels } from "../utils/rankMatcha";
import { assetUrl } from "../utils/assets";

export default function PersonalizedRecommendations({
  selected = [],
  budget,
  personalized,
  recommendations = [],
  total,
  expanded,
  isMember,
  busy,
  error,
  saved,
  onToggle,
  onBudgetChange,
  onReset,
  onUseProfile,
  onSave,
  onExpand,
  onView,
  onAdd,
}) {
  return (
    <Box
      component="section"
      aria-label="มัทฉะที่เหมาะกับคุณ"
      sx={{
        mt: 5,
        p: { xs: 2.5, md: 4 },
        bgcolor: "#183b2a",
        color: "#fffdf9",
      }}
    >
      <Typography
        sx={{ color: "#d6dfac", letterSpacing: ".16em", fontSize: 13 }}
      >
        FIND YOUR MATCHA
      </Typography>
      <Typography variant="h3" sx={{ fontSize: { xs: 28, md: 35 }, mt: 1 }}>
        มัทฉะที่เหมาะกับคุณ
      </Typography>
      <Typography sx={{ mt: 1, mb: 3 }}>
        {personalized
          ? "เริ่มจากความชอบในโปรไฟล์ของคุณ ปรับเพิ่มได้ตามใจ"
          : "เลือกได้หลายข้อ ไม่ต้องตอบครบทุกหมวด เราจะเรียงตัวที่ตรงกับคุณมากที่สุดก่อน"}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        {interestGroups.map((group, index) => (
          <Box
            component="fieldset"
            key={group.title}
            disabled={busy}
            sx={{
              border: "1px solid #6c815e",
              minWidth: 0,
              m: 0,
              p: 2,
              borderRadius: 1,
            }}
          >
            <Typography
              component="legend"
              sx={{ color: "#efe2bd", fontWeight: 700, px: 1 }}
            >
              {index + 1}. {group.title}
            </Typography>
            <Stack>
              {group.options.map((option) => (
                <FormControlLabel
                  key={option.key}
                  label={option.label}
                  control={
                    <Checkbox
                      checked={selected.includes(option.key)}
                      onChange={() => onToggle(option.key)}
                      sx={{
                        color: "#d6dfac",
                        "&.Mui-checked": { color: "#efe2bd" },
                      }}
                    />
                  }
                />
              ))}
            </Stack>
          </Box>
        ))}
      </Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        gap={2}
        flexWrap="wrap"
        sx={{ mt: 3 }}
      >
        <TextField
          select
          label="4. งบประมาณต่อชิ้น"
          value={budget}
          disabled={busy}
          onChange={(event) => onBudgetChange(event.target.value)}
          InputLabelProps={{ sx: { bgcolor: "#fffdf9", px: 0.5 } }}
          sx={{ bgcolor: "#fffdf9", borderRadius: 1, minWidth: 210 }}
        >
          <MenuItem value="">ทุกช่วงราคา</MenuItem>
          {[
            ...new Set([
              "400",
              "600",
              "800",
              "1000",
              ...(budget ? [String(budget)] : []),
            ]),
          ].map((n) => (
            <MenuItem key={n} value={n}>
              ไม่เกิน ฿{Number(n).toLocaleString("th-TH")}
            </MenuItem>
          ))}
        </TextField>
        <Button onClick={onReset} disabled={busy} sx={{ color: "#efe2bd" }}>
          ล้างตัวเลือก
        </Button>
        {isMember && (
          <>
            <Button
              onClick={onUseProfile}
              disabled={busy}
              sx={{ color: "#efe2bd" }}
            >
              ใช้ความชอบจากโปรไฟล์
            </Button>
            <Button
              onClick={onSave}
              disabled={busy}
              variant="contained"
              sx={{ bgcolor: "#efe2bd", color: "#183b2a" }}
            >
              {busy ? "กำลังบันทึก…" : "บันทึกความชอบนี้"}
            </Button>
          </>
        )}
      </Stack>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {saved && (
        <Alert severity="success" sx={{ mt: 2 }}>
          บันทึกความชอบในโปรไฟล์แล้ว
        </Alert>
      )}
      <Typography sx={{ mt: 2, fontSize: 14, color: "#d6dfac" }}>
        คัดตามวิธีชงที่เลือกและไม่เกินงบ
        แล้วจัดอันดับด้วยรสชาติและกลิ่นที่มีข้อมูลในร้าน ·
        รสชาติจริงอาจต่างตามวิธีชง
      </Typography>
      <Typography aria-live="polite" sx={{ mt: 3 }}>
        พบ {total} รายการ · แสดง {recommendations.length} รายการ
        {!expanded && total > 3 ? "แรก" : ""}
      </Typography>
      {!total && (
        <Alert severity="info" sx={{ mt: 2 }}>
          ยังไม่มีสินค้าตรงวิธีชงและงบที่เลือก
          ลองเพิ่มงบหรือเปลี่ยนวิธีชงได้ครับ
        </Alert>
      )}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2,
          mt: 2,
        }}
      >
        {recommendations.map((product, index) => (
          <Box
            key={product.name}
            sx={{
              bgcolor: "#fffdf9",
              color: "#183b2a",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              component="img"
              src={assetUrl(product.image)}
              alt={product.name}
              loading="lazy"
              sx={{ width: "100%", aspectRatio: "4/3", objectFit: "cover" }}
            />
            <Box sx={{ p: 2.5, flex: 1 }}>
              <Typography sx={{ fontSize: 13, color: "#687653" }}>
                ลำดับ {index + 1}
                {selected.length
                  ? ` · ตรงรส/กลิ่น ${product.matched.length} ข้อ`
                  : ""}
              </Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 700, mt: 1 }}>
                {product.name}
              </Typography>
              <Typography sx={{ color: "#96713a", my: 1 }}>
                ฿{product.price} · {product.size}
              </Typography>
              <Typography sx={{ lineHeight: 1.8 }}>{product.reason}</Typography>
              {product.matched.length > 0 && (
                <Typography sx={{ mt: 1, color: "#40682f" }}>
                  ตรงความชอบ:{" "}
                  {product.matched
                    .map((key) => preferenceLabels[key])
                    .join(" · ")}
                </Typography>
              )}
              {product.unconfirmed.length > 0 && (
                <Typography sx={{ mt: 1, fontSize: 14, color: "#746544" }}>
                  ยังไม่มีข้อมูลยืนยันว่าตรง:{" "}
                  {product.unconfirmed
                    .map((key) => preferenceLabels[key])
                    .join(" · ")}
                </Typography>
              )}
            </Box>
            <Stack
              direction="row"
              gap={1}
              flexWrap="wrap"
              sx={{ px: 2.5, pb: 2.5 }}
            >
              <Button onClick={() => onView(product)}>ดูสินค้า →</Button>
              <Button variant="contained" onClick={() => onAdd(product)}>
                ใส่ตะกร้า
              </Button>
            </Stack>
          </Box>
        ))}
      </Box>
      {total > 3 && (
        <Button
          onClick={onExpand}
          variant="outlined"
          sx={{ mt: 3, color: "#efe2bd", borderColor: "#efe2bd" }}
        >
          {expanded ? "แสดงน้อยลง" : `ดูเพิ่มเติม (${total - 3} รายการ)`}
        </Button>
      )}
    </Box>
  );
}
