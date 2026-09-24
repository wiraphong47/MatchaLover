import { matchaMenus } from "./recommendations.js";

export const interestGroups = [
  { title: "วิธีดื่มที่ชอบ", options: matchaMenus },
  {
    title: "รสชาติที่ชอบ",
    options: [
      { key: "strong", label: "รสเข้ม ชาชัด" },
      { key: "light", label: "รสอ่อน ดื่มง่าย" },
      { key: "smooth", label: "นุ่มละมุน กลมกล่อม" },
      { key: "umami", label: "อูมามิ หวานนัว" },
      { key: "low-bitter", label: "ขมน้อย ฝาดน้อย" },
      { key: "bitter", label: "ขมปลายเล็กน้อย" },
    ],
  },
  {
    title: "กลิ่นที่ชอบ",
    options: [
      { key: "fragrant", label: "กลิ่นหอมชาชัด" },
      { key: "fresh", label: "กลิ่นชาเขียวสดชื่น" },
      { key: "nutty", label: "กลิ่นถั่ว หอมมัน" },
      { key: "roasted", label: "กลิ่นคั่วอ่อน ๆ" },
      { key: "delicate", label: "กลิ่นอ่อน ๆ ละมุน" },
    ],
  },
  {
    title: "เนื้อสัมผัสที่ชอบ",
    options: [
      { key: "texture-light", label: "เบาบาง ดื่มคล่อง" },
      { key: "texture-silky", label: "เนียนนุ่ม ลื่นคอ" },
      { key: "texture-creamy", label: "ครีมมี่ เต็มปาก" },
      { key: "texture-rich", label: "เข้มข้น หนักแน่น" },
    ],
  },
  {
    title: "ระดับประสบการณ์",
    options: [
      { key: "level-beginner", label: "เพิ่งเริ่มดื่มมัทฉะ" },
      { key: "level-regular", label: "ดื่มมัทฉะเป็นประจำ" },
      { key: "level-enthusiast", label: "สายมัทฉะจริงจัง" },
    ],
  },
  {
    title: "โอกาสที่ดื่ม",
    options: [
      { key: "occasion-daily", label: "ดื่มง่ายในทุกวัน" },
      { key: "occasion-relax", label: "ช่วงพักผ่อน ละเมียดละไม" },
      { key: "occasion-special", label: "พิธีชงหรือโอกาสพิเศษ" },
      { key: "occasion-cafe", label: "ทำเมนูสไตล์คาเฟ่" },
    ],
  },
];
const options = interestGroups.flatMap((group) => group.options);
const tokens = (note = "") =>
  note
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
export function selectedInterestKeys(note) {
  const values = tokens(note);
  return options
    .filter((option) => values.includes(option.label))
    .map((option) => option.key);
}
export function toggleInterestNote(note, key) {
  const option = options.find((item) => item.key === key);
  if (!option) return note;
  const values = tokens(note);
  return (
    values.includes(option.label)
      ? values.filter((value) => value !== option.label)
      : [...values, option.label]
  ).join(", ");
}
