const text = document.getElementById("text");
const words = document.getElementById("words");
const chars = document.getElementById("chars");
const lines = document.getElementById("lines");
const toastEl = document.getElementById("toast");
let toastTimer;

function toast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800);
}

function updateStats() {
  const v = text.value;
  chars.textContent = Array.from(v).length;
  words.textContent = v.trim() === "" ? 0 : v.trim().split(/\s+/).length;
  lines.textContent = v === "" ? 0 : v.split("\n").length;
}

function setText(v) {
  text.value = v;
  updateStats();
}

text.addEventListener("input", updateStats);

function cleanSpaces() {
  setText(text.value.replace(/[ \t\u00A0]+/g, " ").replace(/ ?\n ?/g, "\n").trim());
  toast("تم تنظيف المسافات");
}
function removeEmptyLines() {
  setText(text.value.split("\n").filter(l => l.trim() !== "").join("\n"));
  toast("تمت إزالة الأسطر الفارغة");
}
function removeDuplicateLines() {
  const seen = new Set();
  const out = text.value.split("\n").filter(l => {
    const k = l.trim();
    if (k === "") return true;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  setText(out.join("\n"));
  toast("تمت إزالة الأسطر المكررة");
}
function removeTashkeel() {
  setText(text.value.replace(/[\u064B-\u065F\u0670]/g, ""));
  toast("تمت إزالة التشكيل");
}
function digitsToWestern() {
  setText(text.value
    .replace(/[٠-٩]/g, d => d.charCodeAt(0) - 0x0660)
    .replace(/[۰-۹]/g, d => d.charCodeAt(0) - 0x06F0));
  toast("تم تحويل الأرقام إلى 123");
}
function digitsToArabic() {
  setText(text.value.replace(/[0-9]/g, d => String.fromCharCode(0x0660 + Number(d))));
  toast("تم تحويل الأرقام إلى ١٢٣");
}
function sortLines() {
  setText(text.value.split("\n").sort((a, b) => a.localeCompare(b, "ar")).join("\n"));
  toast("تم ترتيب الأسطر");
}
async function copyText() {
  if (!text.value) { toast("لا يوجد نص لنسخه"); return; }
  try {
    await navigator.clipboard.writeText(text.value);
    toast("تم نسخ النص 📋");
  } catch (e) {
    text.select();
    try {
      document.execCommand("copy");
      toast("تم نسخ النص 📋");
    } catch (e2) {
      toast("تعذّر النسخ، انسخ النص يدويًا");
    }
  }
}
function clearText() {
  if (text.value && confirm("هل أنت متأكد من حذف النص؟")) {
    setText("");
  }
}
