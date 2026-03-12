import { useState, useEffect, useRef } from "react";

// ─── GOOGLE FONTS ────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=Quicksand:wght@400;500;600;700&family=Cherry+Bomb+One&display=swap";
document.head.appendChild(fontLink);

const faLink = document.createElement("link");
faLink.rel = "stylesheet";
faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
document.head.appendChild(faLink);

// ─── DEMO DATA ───────────────────────────────────────────────────────────────
const DEMO_MENU = [
  { id: 1, name: "Nasi Goreng Spesial", category: "Makanan", price: 35000, description: "Nasi goreng telur, ayam kampung & sayuran segar", emoji: "🍳" },
  { id: 2, name: "Rendang Sapi", category: "Makanan", price: 55000, description: "Rendang daging sapi empuk bumbu rempah Minang", emoji: "🥩" },
  { id: 3, name: "Soto Ayam", category: "Makanan", price: 28000, description: "Soto kuah bening dengan ayam suwir & bihun", emoji: "🍲" },
  { id: 4, name: "Gado-Gado", category: "Makanan", price: 25000, description: "Sayuran rebus dengan saus kacang gurih", emoji: "🥗" },
  { id: 5, name: "Bakso Mercon", category: "Makanan", price: 30000, description: "Bakso pedas level 3 dengan mie kuah kaldu sapi", emoji: "🍜" },
  { id: 6, name: "Ayam Bakar Madu", category: "Makanan", price: 45000, description: "Ayam bakar bumbu madu & kecap manis", emoji: "🍗" },
  { id: 7, name: "Es Teh Manis", category: "Minuman", price: 8000, description: "Teh manis segar dengan es batu", emoji: "🧊" },
  { id: 8, name: "Es Jeruk Peras", category: "Minuman", price: 12000, description: "Jeruk peras segar tanpa pengawet", emoji: "🍊" },
  { id: 9, name: "Jus Alpukat", category: "Minuman", price: 18000, description: "Jus alpukat lembut dengan susu kental manis", emoji: "🥑" },
  { id: 10, name: "Kopi Tubruk", category: "Minuman", price: 10000, description: "Kopi robusta tubruk khas warung nusantara", emoji: "☕" },
  { id: 11, name: "Es Cendol", category: "Minuman", price: 15000, description: "Cendol hijau, santan, gula merah segar", emoji: "🍹" },
  { id: 12, name: "Klepon", category: "Dessert", price: 15000, description: "Kue tradisional isi gula merah tabur kelapa", emoji: "🟢" },
  { id: 13, name: "Pisang Goreng", category: "Dessert", price: 18000, description: "Pisang raja goreng crispy dengan saus coklat", emoji: "🍌" },
  { id: 14, name: "Bubur Sumsum", category: "Dessert", price: 16000, description: "Bubur tepung beras dengan kuah santan manis", emoji: "🍮" },
  { id: 15, name: "Es Doger", category: "Dessert", price: 20000, description: "Es serut kelapa muda, tape, ketan hitam", emoji: "🍧" },
];

const CATEGORIES = ["Semua", "Makanan", "Minuman", "Dessert"];

const formatRupiah = (n) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

// ─── QRIS Generator (demo QRIS string) ────────────────────────────────────────
function generateQRIS(amount, merchantName = "Warung Nusantara") {
  return `00020101021226590014ID.CO.QRIS.WWW0118936009140000988880209QRISNUSANT5204581153033605802ID5916${merchantName.slice(0, 16).padEnd(16)}6013MAKASSAR6105902276304DEMO`;
}

// ─── THEMES ───────────────────────────────────────────────────────────────────
const THEMES = {
  cute: `
    :root {
      --bg-color: #fff5f7;
      --app-bg: #ffffff;
      --text-main: #6d4c41;
      --primary: #ff8fa3;
      --primary-light: #ffcad4;
      --accent: #ffe5ec;
      --border-dash: #ffcad4;
      --shadow: rgba(255,182,193,0.3);
      --font-title: 'Cherry Bomb One', cursive;
      --font-body: 'Quicksand', sans-serif;
      --border-radius: 30px;
      --card-border: #f8edeb;
    }
    body { background: var(--bg-color); color: var(--text-main); }
    .app { font-family: var(--font-body); background: var(--app-bg); box-shadow: 0 10px 40px var(--shadow); border-radius: 0 0 40px 40px; }
    .header { background: #fff; border-bottom: 3px dashed var(--border-dash); }
    .header-title { font-family: var(--font-title); color: var(--primary); text-shadow: 3px 3px 0 var(--accent); font-size: 36px; }
    .cat-btn { border: 2px solid var(--accent); background: #fff; color: var(--primary); border-radius: 25px; font-weight: 700; }
    .cat-btn.active { background: var(--primary); color: #fff; border-color: var(--primary); box-shadow: 0 4px 10px rgba(255,143,163,0.3); }
    .search-input { border: 3px solid var(--card-border); border-radius: 30px; }
    .search-input:focus { border-color: var(--primary-light); box-shadow: 0 0 15px rgba(255,202,212,0.2); }
    .search-icon { color: #ffb6c1; }
    .section-title { font-family: var(--font-title); color: #ffb6c1; font-size: 24px; }
    .menu-card { background: #fff; border-radius: 30px; border: 3px solid var(--card-border); box-shadow: 0 4px 0 var(--card-border); }
    .menu-card:hover { border-color: var(--primary-light); box-shadow: 0 10px 0 var(--primary-light); transform: translateY(-5px); }
    .card-emoji { background: #fffafa; border-bottom: 3px solid var(--card-border); }
    .img-dim { background: rgba(255,255,255,0.9); color: var(--primary); border: 2px solid var(--accent); border-radius: 15px; }
    .card-name { font-weight: 700; color: var(--text-main); }
    .card-price { font-family: var(--font-title); color: var(--primary); }
    .add-btn { border-radius: 50%; background: var(--primary-light); color: #fff; }
    .add-btn:hover { background: var(--primary); transform: scale(1.1) rotate(90deg); }
    .qty-control { background: #fff5f7; border-radius: 25px; border: 2px solid var(--accent); }
    .qty-btn { background: var(--primary-light); color: #fff; border-radius: 50%; }
    .qty-btn:hover { background: var(--primary); }
    .qty-num { color: var(--primary); font-weight: 700; }
    .cart-btn { background: var(--primary); border: 4px solid #fff; border-radius: 40px; font-family: var(--font-title); box-shadow: 0 10px 25px rgba(255,143,163,0.4); }
    .drawer { border-top: 8px solid var(--primary-light); border-radius: 40px 40px 0 0; }
    .drawer-title { font-family: var(--font-title); color: var(--primary); }
    .cart-item-emoji { background: #fff5f7; border: 3px solid var(--accent); border-radius: 20px; }
    .order-summary { background: #fffafa; border-radius: 30px; border: 3px solid var(--card-border); }
    .summary-row.total { font-family: var(--font-title); color: var(--primary); }
    .pay-btn { background: var(--primary); border-radius: 30px; font-family: var(--font-title); box-shadow: 0 8px 20px rgba(255,143,163,0.3); }
    .modal-content { border: 6px solid var(--primary-light); border-radius: 50px; }
    .modal-title { font-family: var(--font-title); color: var(--primary); }
    .qris-frame { background: #fff5f7; border: 4px dashed var(--primary-light); border-radius: 30px; }
    .status-badge { background: #fff5f7; color: var(--primary); border: 3px solid var(--accent); border-radius: 30px; }
    .confirm-btn { background: #12a855; border-radius: 30px; font-family: var(--font-title); width: 100%; color: #fff; }
    .cancel-btn { border: 3px solid var(--card-border); border-radius: 30px; color: #d8c2c0; font-weight: 700; width: 100%; }
    .admin-btn { position: fixed; top: 20px; right: 20px; z-index: 1000; background: var(--primary); color: #fff; width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: none; box-shadow: 0 4px 15px var(--shadow); cursor: pointer; transition: all 0.3s; }
    .admin-btn:hover { transform: rotate(90deg) scale(1.1); }
  `,
  luxury: `
    :root {
      --bg-color: #0c0b0a;
      --app-bg: #11100f;
      --text-main: #e0d5c1;
      --primary: #d4af37;
      --primary-light: rgba(212,175,55,0.4);
      --accent: rgba(212,175,55,0.2);
      --border-dash: rgba(212,175,55,0.2);
      --shadow: rgba(0,0,0,0.8);
      --font-title: 'Playfair Display', serif;
      --font-body: 'DM Sans', sans-serif;
      --border-radius: 0px;
      --card-border: rgba(212,175,55,0.1);
    }
    body { background: var(--bg-color); color: var(--text-main); }
    .app { font-family: var(--font-body); background: var(--app-bg); box-shadow: 0 0 60px var(--shadow); border-radius: 0; }
    .header { background: linear-gradient(180deg, #1a1816 0%, #11100f 100%); border-bottom: 1px solid var(--border-dash); }
    .header-title { font-family: var(--font-title); color: var(--primary); background: linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 32px; }
    .cat-btn { border: none; background: transparent; color: #a3947a; border-radius: 0; text-transform: uppercase; letter-spacing: 1.5px; }
    .cat-btn.active { color: var(--primary); border-bottom: 2px solid var(--primary); }
    .search-input { border: 1px solid var(--border-dash); border-radius: 0; background: rgba(255,255,255,0.03); color: var(--text-main); }
    .search-input:focus { border-color: var(--primary); }
    .search-icon { color: var(--primary); }
    .section-title { font-family: var(--font-title); color: var(--primary); font-size: 20px; }
    .menu-card { background: #1a1816; border-radius: 0; border: 1px solid var(--card-border); }
    .menu-card:hover { border-color: var(--primary-light); box-shadow: 0 15px 40px rgba(0,0,0,0.6); transform: translateY(-5px); }
    .card-emoji { background: #0c0b0a; border-bottom: none; }
    .img-dim { background: rgba(12,11,10,0.8); color: var(--primary); border: 1px solid var(--border-dash); border-radius: 0; }
    .card-name { font-family: var(--font-title); color: var(--text-main); }
    .card-price { font-family: var(--font-body); color: var(--primary); }
    .add-btn { border-radius: 0; background: transparent; border: 1px solid var(--primary); color: var(--primary); }
    .add-btn:hover { background: rgba(212,175,55,0.1); transform: scale(1.05); }
    .qty-control { background: #1a1816; border-radius: 0; border: 1px solid var(--border-dash); }
    .qty-btn { background: transparent; color: var(--primary); border: 1px solid var(--primary-light); border-radius: 0; }
    .qty-btn:hover { background: rgba(212,175,55,0.1); }
    .qty-num { color: var(--text-main); }
    .cart-btn { background: linear-gradient(135deg, #1a1816, #0c0b0a); border: 1px solid var(--primary); border-radius: 0; font-family: var(--font-body); box-shadow: 0 15px 40px rgba(0,0,0,0.6); }
    .drawer { background: #11100f; border-top: 1px solid var(--primary-light); border-radius: 0; }
    .drawer-title { font-family: var(--font-title); color: var(--primary); }
    .cart-item-emoji { background: #0c0b0a; border: 1px solid var(--card-border); border-radius: 0; }
    .order-summary { background: #1a1816; border: 1px solid var(--card-border); border-radius: 0; }
    .summary-row.total { font-family: var(--font-body); color: var(--primary); border-top: 1px solid var(--primary-light); }
    .pay-btn { background: var(--primary); color: #0c0b0a; border-radius: 0; font-family: var(--font-body); font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
    .modal-content { background: #11100f; border: 1px solid var(--primary); border-radius: 0; }
    .modal-title { font-family: var(--font-title); color: var(--primary); }
    .qris-frame { background: #1a1816; border: 1px solid var(--primary-light); border-radius: 0; }
    .status-badge { color: var(--primary); border: 1px solid var(--border-dash); border-radius: 0; }
    .confirm-btn { background: #12a855; border-radius: 0; font-family: var(--font-body); width: 100%; color: #fff; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
    .cancel-btn { background: transparent; border: 1px solid var(--primary-light); border-radius: 0; color: var(--primary); width: 100%; }
    .admin-btn { position: fixed; top: 20px; right: 20px; z-index: 1000; background: rgba(212,175,55,0.1); color: var(--primary); width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid var(--primary); box-shadow: 0 4px 15px rgba(0,0,0,0.5); cursor: pointer; transition: all 0.3s; }
    .admin-btn:hover { transform: rotate(90deg) scale(1.1); background: rgba(212,175,55,0.2); }
  `
};

const baseStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .app { min-height: 100vh; position: relative; overflow-x: hidden; max-width: 1024px; margin: 0 auto; }
  .header { padding: 25px 24px 15px; position: sticky; top: 0; z-index: 100; }
  .header-top { display: flex; align-items: center; justify-content: center; margin-bottom: 20px; text-align: center; }
  .categories { display: flex; gap: 10px; padding-bottom: 5px; overflow-x: auto; scrollbar-width: none; justify-content: center; }
  .cat-btn { padding: 8px 22px; cursor: pointer; white-space: nowrap; transition: all 0.3s; flex-shrink: 0; font-size: 14px; }
  .search-wrap { padding: 20px 24px 10px; position: relative; display: flex; align-items: center; }
  .search-icon { position: absolute; left: 42px; font-size: 16px; pointer-events: none; }
  .search-input { width: 100%; padding: 14px 20px 14px 45px; outline: none; transition: all 0.3s; font-size: 15px; }
  .menu-section { padding: 10px 20px 120px; }
  .menu-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; }
  .menu-card { overflow: hidden; transition: all 0.4s; cursor: pointer; position: relative; }
  .card-emoji { width: 100%; aspect-ratio: 1 / 1; display: flex; align-items: center; justify-content: center; font-size: 4rem; position: relative; overflow: hidden; }
  .img-dim { position: absolute; bottom: 15px; right: 15px; padding: 4px 10px; font-size: 10px; z-index: 10; font-weight: 700; }
  .card-body { padding: 22px; }
  .card-name { font-size: 20px; margin-bottom: 8px; line-height: 1.3; }
  .card-desc { font-size: 13px; margin-bottom: 20px; line-height: 1.5; min-height: 40px; }
  .card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 15px; border-top: 2px dashed #f8edeb; }
  .add-btn { width: 40px; height: 40px; border: none; font-size: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; line-height: 1; padding-bottom: 4px; }
  .qty-control { display: flex; align-items: center; gap: 12px; padding: 5px 12px; }
  .qty-btn { width: 30px; height: 30px; border: none; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: 700; transition: all 0.2s; }
  .qty-num { font-size: 16px; min-width: 20px; text-align: center; }
  .cart-float { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 200; width: calc(100% - 40px); max-width: 440px; }
  .cart-btn { width: 100%; padding: 20px 28px; border: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: all 0.3s; border: none; color: #fff; font-size: 18px; }
  .cart-badge { width: 30px; height: 30px; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #fff; color: inherit; }
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 300; backdrop-filter: blur(10px); }
  .drawer { position: fixed; bottom: 0; left: 0; right: 0; z-index: 400; background: #fff; max-height: 85vh; overflow-y: auto; padding-bottom: env(safe-area-inset-bottom, 20px); }
  .drawer-handle { width: 60px; height: 6px; border-radius: 3px; margin: 15px auto 0; background: rgba(0,0,0,0.05); }
  .drawer-header { padding: 30px; border-bottom: 3px dashed var(--border-dash); display: flex; align-items: center; justify-content: space-between; }
  .close-btn { width: 45px; height: 45px; border: none; font-size: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; background: transparent; color: inherit; }
  .cart-item { display: flex; align-items: center; gap: 15px; padding: 15px 30px; border-bottom: 2px dashed var(--border-dash); }
  .cart-item-emoji { width: 65px; height: 65px; display: flex; align-items: center; justify-content: center; font-size: 28px; flex-shrink: 0; }
  .cart-item-info { flex: 1 }
  .cart-item-name { font-size: 18px; font-weight: 700; margin-bottom: 4px; }
  .order-summary { padding: 25px 30px; margin: 15px 20px; }
  .summary-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 15px; font-weight: 600; }
  .customer-form { padding: 25px 30px; }
  .form-label { font-size: 14px; font-weight: 700; margin-bottom: 10px; display: block; }
  .form-input { width: 100%; padding: 15px 20px; border: 1px solid var(--border-dash); border-radius: 20px; font-size: 16px; margin-bottom: 25px; outline: none; background: transparent; color: inherit; }
  .pay-btn { width: 100%; padding: 22px; border: none; font-size: 20px; cursor: pointer; color: #fff; }
  .modal { position: fixed; inset: 0; z-index: 500; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal-content { padding: 45px 35px; width: 100%; max-width: 460px; text-align: center; position: relative; background: #fff; }
  .qris-frame { padding: 25px; display: inline-block; margin-bottom: 30px; }
  .gdrivewrapper { background: #fff; position: relative; width: 100%; height: 100%; overflow: hidden; }
  .gdrivewrapper iframe { border: 0; position: absolute; top: -50px; left: 0; width: 100%; height: calc(100% + 100px); z-index: 2; }
  .gdrive-overlay { position: absolute; inset: 0; z-index: 5; background: transparent; }
  .loading { text-align: center; padding: 40px; font-weight: 700; opacity: 0.7; }
  .success-wrap { padding: 40px 20px; text-align: center; }
  .success-icon { font-size: 64px; margin-bottom: 20px; }
  .success-title { font-size: 28px; font-weight: 700; margin-bottom: 10px; }
  .success-text { font-size: 16px; opacity: 0.8; margin-bottom: 30px; }
  .new-order-btn { padding: 15px 40px; border-radius: 30px; border: none; background: var(--primary); color: #fff; font-size: 18px; font-weight: 700; cursor: pointer; }

  /* Admin Panel Specific */
  .admin-panel-content { padding: 20px; }
  .theme-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; }
  .theme-card { padding: 20px; border: 3px solid var(--accent); border-radius: 20px; cursor: pointer; transition: all 0.3s; text-align: center; }
  .theme-card.active { border-color: var(--primary); background: var(--accent); }
  .theme-card i { font-size: 24px; margin-bottom: 10px; display: block; }
  .theme-card span { font-weight: 700; font-size: 14px; }
`;

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function WarungApp() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "cute");
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("Semua");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [customer, setCustomer] = useState({ name: "", table: "" });
  const [useSheet, setUseSheet] = useState(true);
  const [sheetId, setSheetId] = useState("1DKh_6dm4osC48kVAsmaGyY68NaiWIDqvC7SwCQ7LdpY");
  const [sheetName, setSheetName] = useState("Menu");
  const [qrUrl, setQrUrl] = useState("");
  const [merchantName, setMerchantName] = useState("Warung Nusantara");
  const [error, setError] = useState("");

  const activeStyles = baseStyles + THEMES[theme];

  // Save theme to local storage
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Convert GDrive link to direct image URL and Preview Link
  const getGDriveInfo = (url) => {
    if (!url) return { url: "", id: "" };
    if (url.includes("drive.google.com")) {
      const match = url.match(/id=([^&]+)/) || url.match(/\/d\/([^/]+)/);
      if (match && match[1]) {
        return {
          url: `https://drive.google.com/uc?export=view&id=${match[1]}`,
          id: match[1],
          preview: `https://drive.google.com/file/preview?id=${match[1]}`
        };
      }
    }
    return { url, id: "" };
  };

  // Load data
  useEffect(() => {
    if (useSheet && sheetId) {
      fetchSheet();
    } else {
      setMenu(DEMO_MENU);
    }
  }, [useSheet, sheetId]);

  // Fetch from Google Sheets
  const fetchSheet = async () => {
    if (!sheetId) return;
    setLoading(true);
    setError("");
    try {
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
      const res = await fetch(url);
      const text = await res.text();
      const json = JSON.parse(text.substring(47, text.length - 2));
      const rows = json.table.rows;
      const cols = json.table.cols.map(c => c.label.toLowerCase());
      const parsed = await Promise.all(rows.map(async (row, i) => {
        const item = {
          id: i + 1,
          name: row.c[cols.indexOf("name")]?.v || row.c[0]?.v || "Item",
          category: row.c[cols.indexOf("category")]?.v || row.c[1]?.v || "Makanan",
          price: parseFloat(row.c[cols.indexOf("price")]?.v || row.c[2]?.v || 0),
          description: row.c[cols.indexOf("description")]?.v || row.c[3]?.v || "",
          image: row.c[cols.indexOf("image")]?.v || row.c[4]?.v || "",
          emoji: row.c[cols.indexOf("emoji")]?.v || row.c[5]?.v || "🍽️",
        };
        const driveInfo = getGDriveInfo(item.image);
        item.imageUrl = driveInfo.url;
        item.fileId = driveInfo.id;
        item.previewUrl = driveInfo.preview;

        // Detect dimensions
        if (item.imageUrl) {
          try {
            const dims = await new Promise((resolve) => {
              const img = new Image();
              img.onload = () => resolve({ w: img.width, h: img.height });
              img.onerror = () => resolve(null);
              img.src = item.imageUrl;
            });
            if (dims) {
              item.width = dims.w;
              item.height = dims.h;
            }
          } catch (e) {
            console.error("Failed to load dimensions", e);
          }
        }
        return item;
      }));
      setMenu(parsed);
    } catch (e) {
      setError("Gagal memuat data. Pastikan Sheet sudah dipublikasikan dan ID benar.");
    }
    setLoading(false);
  };

  const saveSettings = () => {
    if (useSheet) fetchSheet();
    else setMenu(DEMO_MENU);
    setShowSettings(false);
  };

  // Cart helpers
  const addItem = (item) =>
    setCart(c => ({ ...c, [item.id]: { ...item, qty: (c[item.id]?.qty || 0) + 1 } }));
  const removeItem = (id) =>
    setCart(c => {
      const n = { ...c };
      if (n[id].qty > 1) n[id] = { ...n[id], qty: n[id].qty - 1 };
      else delete n[id];
      return n;
    });

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const subtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  const isItemVisible = (item) => {
    const catMatch = category === "Semua" || item.category === category;
    const searchMatch = item.name.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  };

  const handePay = () => {
    if (!customer.name || !customer.table) return;
    const qris = generateQRIS(total, merchantName);
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qris)}&margin=0`;
    setQrUrl(qrApiUrl);
    setShowPayment(true);
    setPaymentConfirmed(false);
  };

  const handleConfirmPayment = () => {
    setPaymentConfirmed(true);
    setTimeout(() => {
      setShowPayment(false);
      setShowCart(false);
      setShowSuccess(true);
      setCart({});
      setCustomer({ name: "", table: "" });
    }, 1000);
  };

  const resetAll = () => {
    setShowSuccess(false);
    setCategory("Semua");
    setSearch("");
  };

  const menuCategoriesSorted = ["Makanan", "Minuman", "Dessert"];

  return (
    <>
      <style>{activeStyles}</style>
      <div className="app">

        {/* ADMIN BUTTON */}
        <button className="admin-btn" onClick={() => setShowSettings(true)}>
          <i className="fa-solid fa-gear"></i>
        </button>

        {/* HEADER */}
        <div className="header">
          <div className="header-top">
            <div className="header-title">{merchantName}</div>
          </div>
          <div className="categories">
            {CATEGORIES.map(cat => (
              <button key={cat} className={`cat-btn ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}>{cat}</button>
            ))}
          </div>
        </div>

        {/* SEARCH */}
        <div className="search-wrap">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input className="search-input" placeholder="Cari menu..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* MENU */}
        <div className="menu-section">
          {loading && <div className="loading">⏳ Memuat menu...</div>}
          {!loading && menuCategoriesSorted.map(grp => {
            const grpItems = menu.filter(i => i.category === grp);
            if (!grpItems.length) return null;

            const isGroupInFilter = category === "Semua" || category === grp;
            const hasVisibleItems = grpItems.some(isItemVisible);
            const showGroup = isGroupInFilter && hasVisibleItems;

            return (
              <div key={grp} style={{ display: showGroup ? 'block' : 'none' }}>
                <div className="section-title">{grp}</div>
                <div className="menu-grid">
                  {grpItems.map(item => (
                    <div key={item.id} className="menu-card" style={{ display: isItemVisible(item) ? 'block' : 'none' }}>
                      <div className="card-emoji">
                        {item.previewUrl ? (
                          <div className="gdrivewrapper">
                            <iframe
                              src={item.previewUrl}
                              width="100%"
                              height="100%"
                              frameBorder="0"
                              allowFullScreen={true}
                              mozallowfullscreen="true"
                              webkitallowfullscreen="true"
                            ></iframe>
                            <div className="gdrive-overlay" />
                            {item.width && item.height && (
                              <div className="img-dim">{item.width} × {item.height}</div>
                            )}
                          </div>
                        ) : item.imageUrl ? (
                          <div style={{ position: "relative", width: "100%", height: "100%" }}>
                            <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            {item.width && item.height && (
                              <div className="img-dim">{item.width} × {item.height}</div>
                            )}
                          </div>
                        ) : (
                          item.emoji || "🍽️"
                        )}
                      </div>
                      <div className="card-body">
                        <div className="card-name">{item.name}</div>
                        <div className="card-desc">{item.description}</div>
                        <div className="card-footer">
                          <div className="card-price">{formatRupiah(item.price)}</div>
                          {cart[item.id] ? (
                            <div className="qty-control">
                              <button className="qty-btn" onClick={() => removeItem(item.id)}>−</button>
                              <span className="qty-num">{cart[item.id].qty}</span>
                              <button className="qty-btn" onClick={() => addItem(item)}>+</button>
                            </div>
                          ) : (
                            <button className="add-btn" onClick={() => addItem(item)}>+</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* FLOAT CART */}
        {cartCount > 0 && !showCart && !showPayment && !showSuccess && (
          <div className="cart-float">
            <button className="cart-btn" onClick={() => setShowCart(true)}>
              <span>🛒 Lihat Pesanan</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, opacity: 0.85 }}>{formatRupiah(total)}</span>
                <div className="cart-badge">{cartCount}</div>
              </div>
            </button>
          </div>
        )}

        {/* CART DRAWER */}
        {showCart && (
          <>
            <div className="overlay" onClick={() => setShowCart(false)} />
            <div className="drawer">
              <div className="drawer-handle" />
              <div className="drawer-header">
                <div className="drawer-title">🛒 Pesanan Anda</div>
                <button className="close-btn" onClick={() => setShowCart(false)}>✕</button>
              </div>

              {cartItems.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-cart-icon">🍽️</div>
                  <div className="empty-cart-text">Belum ada pesanan</div>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cartItems.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="cart-item-emoji">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
                          ) : (
                            item.emoji || "🍽️"
                          )}
                        </div>
                        <div className="cart-item-info">
                          <div className="cart-item-name">{item.name}</div>
                          <div className="cart-item-price">{formatRupiah(item.price)} × {item.qty}</div>
                        </div>
                        <div className="qty-control">
                          <button className="qty-btn" onClick={() => removeItem(item.id)}>−</button>
                          <span className="qty-num">{item.qty}</span>
                          <button className="qty-btn" onClick={() => addItem(item)}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-summary">
                    <div className="summary-row"><span>Subtotal</span><span>{formatRupiah(subtotal)}</span></div>
                    <div className="summary-row"><span>Pajak (10%)</span><span>{formatRupiah(tax)}</span></div>
                    <div className="summary-row total"><span>Total</span><span>{formatRupiah(total)}</span></div>
                  </div>

                  <div className="customer-form">
                    <label className="form-label">Nama Pemesan</label>
                    <input className="form-input" placeholder="Masukkan nama Anda"
                      value={customer.name} onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))} />
                    <label className="form-label">Nomor Meja</label>
                    <input className="form-input" placeholder="Contoh: Meja 5"
                      value={customer.table} onChange={e => setCustomer(c => ({ ...c, table: e.target.value }))} />
                    <button className="pay-btn" onClick={handePay}
                      disabled={!customer.name || !customer.table}
                      style={{ opacity: (!customer.name || !customer.table) ? 0.5 : 1 }}>
                      💳 Bayar dengan QRIS — {formatRupiah(total)}
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* PAYMENT MODAL */}
        {showPayment && (
          <>
            <div className="overlay" />
            <div className="modal">
              <div className="modal-content">
                {!paymentConfirmed ? (
                  <>
                    <div className="modal-title">Scan QRIS</div>
                    <div className="qris-frame">
                      <div className="qris-inner">
                        <img src={qrUrl} alt="QRIS QR Code" className="qris-img"
                          onError={e => { e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DEMO-QRIS-${total}&margin=0`; }} />
                      </div>
                    </div>
                    <div className="amount-display">{formatRupiah(total)}</div>
                    <div className="amount-label">a.n. {customer.name} · {customer.table}</div>
                    <div className="status-badge">⏳ Menunggu Pembayaran...</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
                      <button className="confirm-btn" onClick={handleConfirmPayment}>✓ Konfirmasi Sudah Bayar</button>
                      <button className="cancel-btn" onClick={() => setShowPayment(false)}>Batalkan</button>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: "20px 0" }}>
                    <div className="success-icon">✅</div>
                    <div className="modal-title">Memproses...</div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* SUCCESS */}
        {showSuccess && (
          <div className="overlay" onClick={resetAll}>
            <div className="modal">
              <div className="modal-content">
                <div className="success-wrap">
                  <div className="success-icon">🎉</div>
                  <div className="success-title">Pembayaran Berhasil!</div>
                  <div className="success-text">
                    Terima kasih, <strong>{customer.name}</strong>!<br />
                    Pesanan Anda sedang diproses. Silakan tunggu di {customer.table}.
                  </div>
                  <button className="new-order-btn" onClick={resetAll}>+ Pesan Lagi</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADMIN SETTINGS */}
        {showSettings && (
          <>
            <div className="overlay" onClick={() => setShowSettings(false)} />
            <div className="drawer">
              <div className="drawer-handle" />
              <div className="drawer-header">
                <div className="drawer-title">⚙ Pengaturan Admin</div>
                <button className="close-btn" onClick={() => setShowSettings(false)}>✕</button>
              </div>
              <div className="admin-panel-content">
                <div className="setting-item">
                  <label className="form-label">Pilih Tema</label>
                  <div className="theme-selector">
                    <div className={`theme-card ${theme === 'cute' ? 'active' : ''}`} onClick={() => setTheme('cute')}>
                      <i className="fa-solid fa-face-smile" style={{ color: '#ff8fa3' }}></i>
                      <span>Cute Kawaii</span>
                    </div>
                    <div className={`theme-card ${theme === 'luxury' ? 'active' : ''}`} onClick={() => setTheme('luxury')}>
                      <i className="fa-solid fa-crown" style={{ color: '#d4af37' }}></i>
                      <span>Luxury Gold</span>
                    </div>
                  </div>
                </div>

                <div className="setting-item" style={{ marginTop: '30px' }}>
                  <label className="form-label">Nama Warung</label>
                  <input className="form-input" placeholder="Warung Nusantara"
                    value={merchantName} onChange={e => setMerchantName(e.target.value)} />
                </div>

                <div className="setting-item">
                  <label className="form-label">Sumber Data</label>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 15 }}>
                    <button className={`cat-btn ${!useSheet ? "active" : ""}`} onClick={() => setUseSheet(false)} style={{ flex: 1 }}>Demo</button>
                    <button className={`cat-btn ${useSheet ? "active" : ""}`} onClick={() => setUseSheet(true)} style={{ flex: 1 }}>Sheet</button>
                  </div>
                  {useSheet && (
                    <>
                      <label className="form-label">Sheet ID</label>
                      <input className="form-input" value={sheetId} onChange={e => setSheetId(e.target.value)} />
                      <label className="form-label">Nama Sheet</label>
                      <input className="form-input" value={sheetName} onChange={e => setSheetName(e.target.value)} />
                    </>
                  )}
                </div>
                
                <button className="pay-btn" onClick={saveSettings} style={{ marginTop: '20px' }}>💾 Simpan Perubahan</button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
