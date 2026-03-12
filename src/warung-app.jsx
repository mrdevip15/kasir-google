import { useState, useEffect, useRef } from "react";

// ─── GOOGLE FONTS ────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap";
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
  const amtStr = String(amount).padStart(13, "0");
  // Demo QRIS-like string (not a real payment)
  return `00020101021226590014ID.CO.QRIS.WWW0118936009140000988880209QRISNUSANT5204581153033605802ID5916${merchantName.slice(0, 16).padEnd(16)}6013MAKASSAR6105902276304DEMO`;
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0c0b0a; color: #e0d5c1; }

  .app {
    font-family: 'DM Sans', sans-serif;
    background: #11100f;
    min-height: 100vh;
    position: relative;
    overflow-x: hidden;
    max-width: 1024px;
    margin: 0 auto;
    box-shadow: 0 0 60px rgba(0,0,0,0.8);
    color: #e0d5c1;
  }

  /* HEADER */
  .header {
    background: linear-gradient(180deg, #1a1816 0%, #11100f 100%);
    padding: 30px 24px 10px;
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 1px solid rgba(212,175,55,0.2);
  }
  .header-top {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    text-align: center;
  }
  .header-title {
    font-family: 'Playfair Display', serif;
    color: #d4af37;
    font-size: 32px;
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: 1px;
    background: linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  /* CATEGORIES */
  .categories {
    display: flex;
    gap: 12px;
    padding-bottom: 10px;
    overflow-x: auto;
    scrollbar-width: none;
    justify-content: center;
  }
  .cat-btn {
    padding: 8px 20px;
    border-radius: 0;
    border: none;
    background: transparent;
    color: #a3947a;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.3s;
    flex-shrink: 0;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    position: relative;
  }
  .cat-btn::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 1px;
    background: #d4af37;
    transition: all 0.3s;
    transform: translateX(-50%);
  }
  .cat-btn.active {
    color: #d4af37;
    font-weight: 600;
  }
  .cat-btn.active::after {
    width: 30px;
  }

  /* SEARCH */
  .search-wrap {
    padding: 24px 24px 12px;
    background: #11100f;
    position: relative;
    display: flex;
    align-items: center;
  }
  .search-icon {
    position: absolute;
    left: 40px;
    color: #d4af37;
    font-size: 14px;
    pointer-events: none;
  }
  .search-input {
    width: 100%;
    padding: 12px 20px 12px 40px;
    border: 1px solid rgba(212,175,55,0.2);
    border-radius: 0;
    background: rgba(255,255,255,0.03);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #e0d5c1;
    outline: none;
    transition: all 0.3s;
  }
  .search-input:focus { 
    border-color: #d4af37; 
    background: rgba(255,255,255,0.05);
    box-shadow: 0 0 15px rgba(212,175,55,0.1);
  }
  .search-input::placeholder { color: #5a5449; }

  /* MENU GRID */
  .menu-section { padding: 10px 24px 120px; }
  .section-title {
    font-family: 'Playfair Display', serif;
    color: #d4af37;
    font-size: 20px;
    font-weight: 600;
    margin: 30px 0 20px;
    text-align: center;
    position: relative;
    padding-bottom: 15px;
  }
  .section-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, transparent, #d4af37, transparent);
  }

  .menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
  }

  .menu-card {
    background: #1a1816;
    border-radius: 0;
    overflow: hidden;
    transition: transform 0.4s, box-shadow 0.4s;
    cursor: pointer;
    border: 1px solid rgba(212,175,55,0.1);
    position: relative;
  }
  .menu-card:hover {
    transform: translateY(-8px);
    border-color: rgba(212,175,55,0.4);
    box-shadow: 0 15px 40px rgba(0,0,0,0.6);
  }
  .card-emoji {
    width: 100%;
    aspect-ratio: 1 / 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    background: #0c0b0a;
    position: relative;
    overflow: hidden;
  }

  .img-dim {
    position: absolute;
    bottom: 12px;
    right: 12px;
    background: rgba(12,11,10,0.8);
    color: #d4af37;
    padding: 3px 8px;
    font-size: 9px;
    z-index: 10;
    letter-spacing: 1px;
    border: 1px solid rgba(212,175,55,0.2);
  }
  .card-body { padding: 20px; background: #1a1816; }
  .card-name {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 600;
    color: #e0d5c1;
    margin-bottom: 8px;
    line-height: 1.3;
  }
  .card-desc {
    font-size: 12px;
    color: #8a8171;
    margin-bottom: 20px;
    line-height: 1.6;
    min-height: 38px;
    font-weight: 300;
  }
  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(212,175,55,0.1);
    padding-top: 15px;
  }
  .card-price {
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 600;
    color: #d4af37;
    letter-spacing: 0.5px;
  }
  .add-btn {
    width: 36px;
    height: 36px;
    border-radius: 0;
    background: transparent;
    border: 1px solid #d4af37;
    color: #d4af37;
    font-size: 18px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.15s;
    line-height: 1;
    padding-bottom: 1px;
  }
  .add-btn:hover { transform: scale(1.1); }

  .qty-control {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .qty-btn {
    width: 28px;
    height: 28px;
    border-radius: 0;
    border: 1px solid rgba(212,175,55,0.4);
    background: transparent;
    color: #d4af37;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 300;
    transition: all 0.2s;
  }
  .qty-btn:hover { background: rgba(212,175,55,0.1); }
  .qty-num {
    font-size: 14px;
    font-weight: 500;
    color: #e0d5c1;
    min-width: 20px;
    text-align: center;
  }

  /* FLOATING CART */
  .cart-float {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 200;
    width: calc(100% - 48px);
    max-width: 440px;
  }
  .cart-btn {
    width: 100%;
    padding: 18px 24px;
    background: linear-gradient(135deg, #1a1816, #0c0b0a);
    border: 1px solid #d4af37;
    border-radius: 0;
    color: #d4af37;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 15px 40px rgba(0,0,0,0.6);
    transition: all 0.3s;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .cart-btn:hover { background: #1a1816; box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
  .cart-badge {
    background: #d4af37;
    color: #0c0b0a;
    width: 24px;
    height: 24px;
    border-radius: 0;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* OVERLAY */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    z-index: 300;
    backdrop-filter: blur(8px);
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

  /* DRAWER */
  .drawer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 400;
    background: #11100f;
    border-top: 1px solid rgba(212,175,55,0.3);
    max-height: 85vh;
    overflow-y: auto;
    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    padding-bottom: env(safe-area-inset-bottom, 20px);
  }
  @keyframes slideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
  .drawer-handle {
    width: 40px;
    height: 1px;
    background: rgba(212,175,55,0.3);
    margin: 15px auto 0;
  }
  .drawer-header {
    padding: 24px;
    border-bottom: 1px solid rgba(212,175,55,0.1);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .drawer-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    color: #d4af37;
    letter-spacing: 1px;
  }
  .close-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    color: #d4af37;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  .close-btn:hover { transform: rotate(90deg); }

  /* CART ITEMS */
  .cart-items { padding: 20px 0; }
  .cart-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 24px;
    border-bottom: 1px solid rgba(212,175,55,0.05);
  }
  .cart-item-emoji {
    width: 60px;
    height: 60px;
    background: #0c0b0a;
    border: 1px solid rgba(212,175,55,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    flex-shrink: 0;
  }
  .cart-item-info { flex: 1 }
  .cart-item-name {
    font-family: 'Playfair Display', serif;
    font-size: 16px;
    font-weight: 600;
    color: #e0d5c1;
    margin-bottom: 4px;
  }
  .cart-item-price {
    font-size: 13px;
    color: #d4af37;
    font-weight: 500;
  }

  /* ORDER SUMMARY */
  .order-summary {
    padding: 24px;
    background: #1a1816;
    border-top: 1px solid rgba(212,175,55,0.1);
    border-bottom: 1px solid rgba(212,175,55,0.1);
    margin: 10px 0;
  }
  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    font-size: 14px;
    color: #8a8171;
  }
  .summary-row.total {
    font-size: 18px;
    font-weight: 700;
    color: #d4af37;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid rgba(212,175,55,0.2);
    margin-bottom: 0;
    letter-spacing: 0.5px;
  }

  /* CUSTOMER FORM */
  .customer-form { padding: 24px; }
  .form-label {
    font-size: 11px;
    font-weight: 600;
    color: #d4af37;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 10px;
    display: block;
  }
  .form-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid rgba(212,175,55,0.2);
    border-radius: 0;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: #e0d5c1;
    margin-bottom: 20px;
    outline: none;
    background: rgba(255,255,255,0.03);
    transition: all 0.3s;
  }
  .form-input:focus { border-color: #d4af37; background: rgba(255,255,255,0.05); }

  .pay-btn {
    width: 100%;
    padding: 20px;
    background: #d4af37;
    border: none;
    border-radius: 0;
    color: #0c0b0a;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 2px;
    text-transform: uppercase;
    transition: all 0.3s;
  }
  .pay-btn:hover { background: #fcf6ba; transform: translateY(-2px); }

  /* PAYMENT MODAL */
  .modal {
    position: fixed;
    inset: 0;
    z-index: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .modal-content {
    background: #11100f;
    border: 1px solid #d4af37;
    padding: 40px 30px;
    width: 100%;
    max-width: 440px;
    animation: fadeIn 0.4s ease;
    text-align: center;
    box-shadow: 0 30px 100px rgba(0,0,0,0.9);
  }
  .modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 700;
    color: #d4af37;
    margin-bottom: 8px;
  }
  .modal-subtitle { font-size: 14px; color: #8a8171; margin-bottom: 30px; }
  .qris-frame {
    background: #1a1816;
    border: 1px solid rgba(212,175,55,0.3);
    padding: 20px;
    display: inline-block;
    margin-bottom: 24px;
  }
  .qris-inner {
    background: #fff;
    padding: 10px;
  }
  .qris-img { width: 220px; height: 220px; display: block; }
  .qris-label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 15px;
    color: #d4af37;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 3px;
    text-transform: uppercase;
  }
  .amount-display {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: #e0d5c1;
    margin-bottom: 8px;
  }
  .amount-label { font-size: 12px; color: #8a8171; margin-bottom: 30px; }
  .status-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border: 1px solid rgba(212,175,55,0.2);
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 24px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .status-waiting { color: #d4af37; }
  .status-paid { background: rgba(10,122,61,0.2); color: #12a855; border-color: #12a855; }
  
  .confirm-btn {
    width: 100%;
    padding: 18px;
    background: #12a855;
    color: #fff;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .cancel-btn {
    width: 100%;
    padding: 15px;
    background: transparent;
    border: 1px solid rgba(212,175,55,0.3);
    color: #d4af37;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }

  /* SETTINGS PANEL */
  .settings-content { padding: 16px 24px 24px; }
  .settings-desc { font-size: 13px; color: #9a7a5a; margin-bottom: 16px; line-height: 1.6; }
  .settings-desc a { color: #8b3a0f; }
  .mode-toggle {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }
  .mode-btn {
    flex: 1;
    padding: 10px;
    border-radius: 10px;
    border: 1.5px solid #e8d4b8;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    color: #6b4423;
    transition: all 0.2s;
  }
  .mode-btn.active {
    background: #3d1a00;
    color: #f5d49c;
    border-color: #3d1a00;
  }
  .save-btn {
    width: 100%;
    padding: 12px;
    background: #3d1a00;
    border: none;
    border-radius: 12px;
    color: #f5d49c;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }

  /* SUCCESS */
  .success-wrap { text-align: center; padding: 20px 24px 32px; }
  .success-icon { font-size: 64px; margin-bottom: 12px; }
  .success-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    font-weight: 700;
    color: #3d1a00;
    margin-bottom: 6px;
  }
  .success-text { font-size: 14px; color: #9a7a5a; margin-bottom: 24px; line-height: 1.6; }
  .new-order-btn {
    padding: 14px 32px;
    background: linear-gradient(135deg, #3d1a00, #8b3a0f);
    border: none;
    border-radius: 14px;
    color: #f5d49c;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
  }

  /* EMPTY */
  .empty-cart { text-align: center; padding: 40px 24px; color: #c9956a; }
  .empty-cart-icon { font-size: 48px; margin-bottom: 8px; }
  .empty-cart-text { font-size: 14px; }
  .loading { text-align: center; padding: 40px; color: #c9956a; font-size: 14px; }

  /* GDRIVE WRAPPER */
  .gdrivewrapper {
    background: #fff;
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .gdrivewrapper iframe {
    border: 0;
    position: absolute;
    top: -50px;
    left: 0;
    width: 100%;
    height: calc(100% + 100px);
    z-index: 2;
  }
  .gdrive-overlay {
    position: absolute;
    inset: 0;
    z-index: 5;
    background: transparent;
  }
  .gdrivewrapper a {
    color: rgba(0,0,0,0);
    position: absolute;
    left: 0;
    top: 0;
    z-index: 0;
  }
`;

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function WarungApp() {
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

  const menuCategories = ["Makanan", "Minuman", "Dessert"];

  const handlePay = () => {
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

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* HEADER */}
        <div className="header">
          <div className="header-top">
            <div>
              <div className="header-title">{merchantName}</div>
            </div>
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
          {!loading && menuCategories.map(grp => {
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
                    <button className="pay-btn" onClick={handlePay}
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
                    <div className="modal-subtitle">Scan QR Code di bawah untuk membayar</div>
                    <div className="qris-frame">
                      <div className="qris-inner">
                        <img src={qrUrl} alt="QRIS QR Code" className="qris-img"
                          onError={e => { e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DEMO-QRIS-${total}&margin=0`; }} />
                      </div>
                      <div className="qris-label">
                        <span>⬛</span> QRIS <span>⬛</span>
                      </div>
                    </div>
                    <div className="amount-display">{formatRupiah(total)}</div>
                    <div className="amount-label">a.n. {customer.name} · {customer.table}</div>
                    <div className="status-badge status-waiting">⏳ Menunggu Pembayaran...</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: "100%" }}>
                      <button className="confirm-btn" onClick={handleConfirmPayment}>✓ Konfirmasi Sudah Bayar</button>
                      <button className="cancel-btn" onClick={() => setShowPayment(false)}>Batalkan</button>
                    </div>
                  </>
                ) : (
                  <div style={{ padding: "20px 0" }}>
                    <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
                    <div className="modal-title">Memproses...</div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* SUCCESS */}
        {showSuccess && (
          <>
            <div className="overlay" />
            <div className="drawer" style={{ borderRadius: "24px 24px 0 0" }}>
              <div className="drawer-handle" />
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
          </>
        )}

        {/* SETTINGS */}
        {showSettings && (
          <>
            <div className="overlay" onClick={() => setShowSettings(false)} />
            <div className="drawer">
              <div className="drawer-handle" />
              <div className="drawer-header">
                <div className="drawer-title">⚙ Pengaturan</div>
                <button className="close-btn" onClick={() => setShowSettings(false)}>✕</button>
              </div>
              <div className="settings-content">
                <label className="form-label">Nama Warung / Restoran</label>
                <input className="form-input" placeholder="Warung Nusantara"
                  value={merchantName} onChange={e => setMerchantName(e.target.value)} />

                <label className="form-label" style={{ marginBottom: 8 }}>Sumber Data Menu</label>
                <div className="mode-toggle">
                  <button className={`mode-btn ${!useSheet ? "active" : ""}`} onClick={() => setUseSheet(false)}>
                    📋 Demo Data
                  </button>
                  <button className={`mode-btn ${useSheet ? "active" : ""}`} onClick={() => setUseSheet(true)}>
                    📊 Google Sheet
                  </button>
                </div>

                {useSheet && (
                  <>
                    <div className="settings-desc">
                      Buat Google Sheet dengan kolom: <strong>name, category, price, description, image, id</strong><br />
                      Publikasikan sheet (File → Share → Publish to web), lalu masukkan ID sheet di bawah.
                    </div>
                    <label className="form-label">Google Sheet ID</label>
                    <input className="form-input" placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms"
                      value={sheetId} onChange={e => setSheetId(e.target.value)} />
                    <label className="form-label">Nama Sheet</label>
                    <input className="form-input" placeholder="Menu"
                      value={sheetName} onChange={e => setSheetName(e.target.value)} />
                    {error && <div style={{ color: "#c0392b", fontSize: 13, marginBottom: 12, padding: "8px 12px", background: "#fdf0ed", borderRadius: 8 }}>{error}</div>}
                  </>
                )}
                <button className="save-btn" onClick={saveSettings}>💾 Simpan & Terapkan</button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
