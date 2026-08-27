import { Box, Button, Stack, TextField, Typography } from "@mui/material";

const categories = [["all", "ทั้งหมด"], ["matcha", "มัทฉะ"], ["package", "แพ็กเกจ"], ["tools", "อุปกรณ์ชง"]];
export default function CatalogControls({ category, onCategoryChange, query, onQueryChange }) {
  return <Box sx={{ mt: 4, mb: 4, p: { xs: 2, md: 2.5 }, bgcolor: "#fffdf9", border: "1px solid #dcd3c2" }}><Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2} alignItems={{ md: "center" }}><Box><Typography sx={{ fontWeight: 700, color: "#183b2a" }}>ค้นหาสินค้า</Typography><Stack direction="row" flexWrap="wrap" gap={.8} sx={{ mt: 1.2 }}>{categories.map(([value, label]) => <Button key={value} onClick={() => onCategoryChange(value)} variant={category === value ? "contained" : "outlined"} size="small" sx={category === value ? { bgcolor: "#183b2a" } : { color: "#183b2a", borderColor: "#b9b39f" }}>{label}</Button>)}</Stack></Box><TextField value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="ค้นหาชื่อสินค้า หรือการใช้งาน" size="small" sx={{ minWidth: { md: 300 } }} /></Stack></Box>;
}
