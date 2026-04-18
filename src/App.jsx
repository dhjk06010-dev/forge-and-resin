import { useState, useEffect, useRef } from "react";

// ==================== DEFAULT DATA ====================
const DEFAULT_PRODUCTS = [
  { id: 1, name: "Dragonlord Azareth", category: "Dragons", price: 34.99, scale: "75mm", detail: "Ultra", badge: "Best Seller", desc: "A towering dragon lord perched upon ancient ruins, wings unfurled. Exquisite scale detail and battle-scarred armor.", image: "" },
  { id: 2, name: "Shadow Assassin", category: "Characters", price: 18.99, scale: "32mm", detail: "High", badge: "New", desc: "A cloaked rogue mid-leap, daggers drawn. Dynamic pose with flowing cape and intricate leather armor texture.", image: "" },
  { id: 3, name: "Ancient Treant", category: "Monsters", price: 42.99, scale: "100mm", detail: "Ultra", badge: "", desc: "A massive sentient tree awakened to war. Bark texture with embedded runes and moss detail throughout.", image: "" },
  { id: 4, name: "Paladin of Dawn", category: "Characters", price: 16.99, scale: "32mm", detail: "High", badge: "", desc: "A noble warrior in ornate plate armor raising a blessed warhammer. Flowing tabard with embossed sun emblem.", image: "" },
  { id: 5, name: "Goblin Warband (x6)", category: "Units", price: 28.99, scale: "28mm", detail: "Standard", badge: "Popular", desc: "Six unique goblin sculpts with varied weapons and expressions. Perfect for tabletop skirmish games.", image: "" },
  { id: 6, name: "Eldritch Horror", category: "Monsters", price: 54.99, scale: "120mm", detail: "Ultra", badge: "Limited", desc: "A writhing cosmic entity with countless tendrils and eyes. Our most complex print — over 200 hours of sculpting.", image: "" },
  { id: 7, name: "Dungeon Terrain Set", category: "Terrain", price: 39.99, scale: "28mm", detail: "High", badge: "", desc: "12-piece modular dungeon set: walls, pillars, archways, and a treasure room centerpiece.", image: "" },
  { id: 8, name: "Necromancer Queen", category: "Characters", price: 22.99, scale: "32mm", detail: "High", badge: "New", desc: "A spectral sorceress hovering above a cracked summoning circle. Ethereal robes and skull-topped staff.", image: "" },
];

const DEFAULT_SITE_TEXT = {
  heroTagline: "Precision 3D Resin Printing",
  heroTitleLine1: "Miniatures Forged",
  heroTitleLine2: "in Light & Resin",
  heroSubtitle: "Hand-supported, cured, and inspected. Every layer matters.",
  stat1Value: "0.03mm", stat1Label: "Layer Height",
  stat2Value: "8K", stat2Label: "LCD Resolution",
  stat3Value: "48hr", stat3Label: "Avg. Ship Time",
  aboutTitle: "Crafted with Obsession",
  aboutP1: "Forge & Resin was born from a simple frustration: miniatures that didn't live up to their digital sculpts. We use top-tier 8K mono LCD printers, premium resin blends, and a meticulous post-processing pipeline to deliver prints that look as good on your table as they do on screen.",
  aboutP2: "Every miniature is hand-supported for optimal detail, UV-cured in a controlled environment, and individually inspected before shipping. We don't do mass production — we do precision craft.",
  aboutP3: "Based in Brisbane, we ship Australia-wide and internationally. Most orders dispatch within 48 hours.",
  footerText: "© 2026 FORGE & RESIN · Brisbane, Australia · All rights reserved",
};

const DEFAULT_FAQ = [
  { q: "What resin do you use?", a: "We use a blend of ABS-like and water-washable resins depending on the model. All resins are UV-stable and low-odor." },
  { q: "Are miniatures pre-assembled?", a: "Smaller models ship fully assembled. Larger kits (75mm+) may ship in parts for safer transit and painting flexibility." },
  { q: "Do you do custom prints?", a: "Yes! Send us your STL files and we'll quote you. We support files from all major sculpting tools." },
  { q: "How do I paint resin minis?", a: "Our prints are primed-ready. We recommend a light coat of spray primer before painting with acrylics." },
  { q: "What's your return policy?", a: "If a print arrives damaged or defective, we'll replace it free of charge. Just send us a photo within 7 days." },
];

// ==================== CHANGE YOUR PASSWORD HERE ====================
const ADMIN_PASSWORD = "Banana990717@";
// ===================================================================

// ==================== PAYPAL CONFIG ====================
// Replace this with your real PayPal Client ID from:
// https://developer.paypal.com/dashboard/applications
// Use your LIVE client ID when ready to accept real payments.
// The one below is the PayPal SANDBOX (test) ID — no real money.
const PAYPAL_CLIENT_ID = "Af8uztf1PUW-IwWgMD_zk3Xt81NzInure40RGmFtr9D4IKH65MULCq-QxLrRWdpZx-JqVzTfGQg62AU6";
// Set to "AUD" for Australian dollars
const CURRENCY = "AUD";
// =======================================================

const DEFAULT_CATEGORIES = ["Characters", "Dragons", "Monsters", "Units", "Terrain"];
const DETAIL_LEVELS = ["Standard", "High", "Ultra"];
const BADGE_OPTIONS = ["", "Best Seller", "New", "Popular", "Limited"];

const REVIEWS = [
  { name: "Mike T.", text: "The detail on the Dragonlord is insane. Best resin mini I've ever bought.", rating: 5 },
  { name: "Sarah K.", text: "Fast shipping to Melbourne, prints were flawless. Already ordered more!", rating: 5 },
  { name: "James R.", text: "The terrain set is perfectly scaled. My DnD group was blown away.", rating: 5 },
];

const loadFromStorage = (key, fallback) => {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
};
const saveToStorage = (key, data) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
};

// ==================== ICONS ====================
const CartIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
const StarIcon = ({ filled }) => <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const XIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const MinusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const ChevronDown = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>;
const EditIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const LockIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const LogOutIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

// ==================== PLACEHOLDER ====================
const MiniPlaceholder = ({ product }) => {
  const hues = { Dragons: 4, Characters: 230, Monsters: 270, Units: 155, Terrain: 28 };
  const hue = hues[product.category] || ((product.category || "").charCodeAt(0) * 7) % 360;

  if (product.image) {
    return (
      <div style={{ width: "100%", aspectRatio: "1", overflow: "hidden", borderRadius: "6px 6px 0 0", position: "relative", background: "#f5f5f4" }}>
        <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={(e) => { e.target.style.display = "none"; }}/>
        <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(255,255,255,0.9)", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", color: "#1a1a2e", fontFamily: "'DM Mono', monospace", letterSpacing: "0.5px", backdropFilter: "blur(4px)" }}>{product.scale}</div>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", aspectRatio: "1", background: `linear-gradient(145deg, hsl(${hue}, 30%, 94%), hsl(${hue}, 25%, 88%))`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", borderRadius: "6px 6px 0 0" }}>
      <div style={{ position: "absolute", width: "70%", height: "70%", borderRadius: "50%", background: `radial-gradient(circle, hsla(${hue}, 50%, 70%, 0.2), transparent 70%)`, top: "15%", left: "15%", filter: "blur(25px)" }}/>
      <svg width="45%" height="45%" viewBox="0 0 100 100" style={{ position: "relative", zIndex: 1, opacity: 0.35 }}>
        <g fill={`hsl(${hue},45%,45%)`}><circle cx="50" cy="25" r="10"/><rect x="40" y="35" width="20" height="30" rx="3"/><rect x="35" y="65" width="10" height="22" rx="2"/><rect x="55" y="65" width="10" height="22" rx="2"/></g>
      </svg>
      <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(255,255,255,0.8)", padding: "3px 8px", borderRadius: "4px", fontSize: "11px", color: `hsl(${hue},40%,40%)`, fontFamily: "'DM Mono', monospace", letterSpacing: "0.5px", backdropFilter: "blur(4px)" }}>{product.scale}</div>
    </div>
  );
};

const Badge = ({ text }) => {
  if (!text) return null;
  const colors = { "Best Seller": { bg: "#fef3c7", color: "#92400e", border: "#fde68a" }, "New": { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" }, "Popular": { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" }, "Limited": { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" } };
  const c = colors[text] || colors["New"];
  return <span style={{ position: "absolute", top: 10, left: 10, padding: "3px 10px", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", background: c.bg, color: c.color, border: `1px solid ${c.border}`, borderRadius: "4px", fontFamily: "'DM Mono', monospace", zIndex: 2 }}>{text}</span>;
};

// ==================== PAYPAL BUTTON ====================
function PayPalButton({ total, currency, onSuccess, onError }) {
  const containerRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (window.paypal) { setSdkReady(true); setLoading(false); return; }
    const existingScript = document.querySelector('script[src*="paypal.com/sdk"]');
    if (existingScript) { existingScript.addEventListener("load", () => { setSdkReady(true); setLoading(false); }); return; }
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currency}`;
    script.async = true;
    script.onload = () => { setSdkReady(true); setLoading(false); };
    script.onerror = () => { setLoading(false); onError("Failed to load PayPal. Check your internet connection."); };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!sdkReady || !containerRef.current || !window.paypal) return;
    containerRef.current.innerHTML = "";
    window.paypal.Buttons({
      style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal", height: 45 },
      createOrder: (data, actions) => actions.order.create({
        purchase_units: [{ amount: { value: total.toFixed(2), currency_code: currency } }]
      }),
      onApprove: async (data, actions) => {
        try {
          const details = await actions.order.capture();
          onSuccess(details);
        } catch (err) { onError("Payment capture failed. Please contact us."); }
      },
      onError: (err) => { onError("PayPal encountered an error. Please try again."); },
      onCancel: () => {}
    }).render(containerRef.current);
  }, [sdkReady, total]);

  if (loading) return <div style={{ textAlign: "center", padding: 20, color: "#a8a29e", fontFamily: "'DM Mono', monospace", fontSize: 12 }}>Loading PayPal...</div>;
  return <div ref={containerRef} style={{ marginTop: 16 }}/>;
}

// ==================== MAIN APP ====================
export default function MiniatureShop() {
  const [route, setRoute] = useState(typeof window !== "undefined" && window.location.hash === "#admin" ? "admin" : "shop");

  useEffect(() => {
    const handler = () => setRoute(window.location.hash === "#admin" ? "admin" : "shop");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const [products, setProducts] = useState(() => loadFromStorage("fr_products", DEFAULT_PRODUCTS));
  const [siteText, setSiteText] = useState(() => loadFromStorage("fr_siteText", DEFAULT_SITE_TEXT));
  const [faqs, setFaqs] = useState(() => loadFromStorage("fr_faqs", DEFAULT_FAQ));
  const [orders, setOrders] = useState(() => loadFromStorage("fr_orders", []));
  const [categories, setCategories] = useState(() => loadFromStorage("fr_categories", DEFAULT_CATEGORIES));

  useEffect(() => saveToStorage("fr_products", products), [products]);
  useEffect(() => saveToStorage("fr_siteText", siteText), [siteText]);
  useEffect(() => saveToStorage("fr_faqs", faqs), [faqs]);
  useEffect(() => saveToStorage("fr_orders", orders), [orders]);
  useEffect(() => saveToStorage("fr_categories", categories), [categories]);

  if (route === "admin") {
    return <AdminPanel products={products} setProducts={setProducts} siteText={siteText} setSiteText={setSiteText} faqs={faqs} setFaqs={setFaqs} orders={orders} setOrders={setOrders} categories={categories} setCategories={setCategories}/>;
  }

  return <Shop products={products} siteText={siteText} faqs={faqs} categories={categories} onOrder={(order) => setOrders(prev => [order, ...prev])}/>;
}

// ==================== SHOP ====================
function Shop({ products, siteText, faqs, categories, onOrder }) {
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentSection, setCurrentSection] = useState("shop");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const toastTimeout = useRef(null);

  const categoryList = ["All", ...categories];
  const filtered = category === "All" ? products : products.filter(p => p.category === category);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.qty * i.price, 0);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? {...i, qty: i.qty + 1} : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`${product.name} added to cart`);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? {...i, qty: Math.max(0, i.qty + delta)} : i).filter(i => i.qty > 0));
  };

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimeout.current) clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast(null), 2500);
  };

  const handleCheckoutComplete = (customerInfo, paypalDetails) => {
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      customer: customerInfo,
      items: cart,
      total: cartTotal,
      status: paypalDetails ? "paid" : "pending",
      paypal: paypalDetails ? { id: paypalDetails.id, payer: paypalDetails.payer?.email_address || "unknown" } : null
    };
    onOrder(order);
    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
    showToast(paypalDetails ? "Payment successful! Order confirmed." : "Order placed!");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf9", color: "#1a1a2e", fontFamily: "'Playfair Display', Georgia, serif" }}>
      <style>{globalStyles}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(250,250,249,0.9)", backdropFilter: "blur(16px)", borderBottom: "1px solid #e7e5e4" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="30" height="30" viewBox="0 0 32 32"><polygon points="16,2 28,10 28,22 16,30 4,22 4,10" fill="none" stroke="#1a1a2e" strokeWidth="1.5"/><polygon points="16,8 22,12 22,20 16,24 10,20 10,12" fill="#c2410c" opacity="0.2"/><circle cx="16" cy="16" r="3" fill="#c2410c"/></svg>
            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 21, color: "#1a1a2e", letterSpacing: "1px" }}>Forge & Resin</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {["shop", "about", "faq"].map(s => (
              <span key={s} className="nav-link" onClick={() => setCurrentSection(s)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "1.5px", textTransform: "uppercase", color: currentSection === s ? "#c2410c" : "#78716c", fontWeight: currentSection === s ? 500 : 400 }}>{s}</span>
            ))}
            <button onClick={() => setCartOpen(true)} style={{ background: "#1a1a2e", border: "none", borderRadius: 6, color: "#fff", padding: "8px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
              <CartIcon/>
              {cartCount > 0 && <span style={{ background: "#c2410c", color: "#fff", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      {currentSection === "shop" && (
        <header style={{ position: "relative", overflow: "hidden", padding: "80px 24px 72px", textAlign: "center", background: "#fff" }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.35, backgroundImage: "radial-gradient(circle, #d6d3d1 1px, transparent 1px)", backgroundSize: "24px 24px" }}/>
          <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(194,65,12,0.06), transparent 65%)" }}/>
          <div className="fade-up" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "4px", color: "#c2410c", textTransform: "uppercase", marginBottom: 16, fontWeight: 500 }}>{siteText.heroTagline}</div>
            <h1 style={{ fontSize: "clamp(38px, 6vw, 68px)", fontWeight: 800, lineHeight: 1.08, color: "#1a1a2e", marginBottom: 18 }}>
              {siteText.heroTitleLine1}<br/><span style={{ color: "#c2410c", fontStyle: "italic" }}>{siteText.heroTitleLine2}</span>
            </h1>
            <p style={{ fontSize: 18, color: "#a8a29e", maxWidth: 480, margin: "0 auto 36px", fontStyle: "italic", lineHeight: 1.6 }}>{siteText.heroSubtitle}</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              {[{ label: siteText.stat1Value, sub: siteText.stat1Label }, { label: siteText.stat2Value, sub: siteText.stat2Label }, { label: siteText.stat3Value, sub: siteText.stat3Label }].map((s, i) => (
                <div key={i} style={{ padding: "16px 28px", border: "1px solid #e7e5e4", borderRadius: 8, background: "#fafaf9" }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, color: "#c2410c", fontWeight: 500 }}>{s.label}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#a8a29e", letterSpacing: "1px", textTransform: "uppercase", marginTop: 4 }}>{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </header>
      )}

      {/* MAIN */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px" }}>
        {currentSection === "shop" && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap", borderBottom: "1px solid #e7e5e4", paddingBottom: 20 }}>
              {categoryList.map(c => (
                <button key={c} className="cat-btn" onClick={() => setCategory(c)} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "1.2px", textTransform: "uppercase", padding: "8px 18px", borderRadius: 6, color: category === c ? "#fff" : "#78716c", background: category === c ? "#1a1a2e" : "#f5f5f4", fontWeight: 500 }}>{c}</button>
              ))}
            </div>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#a8a29e" }}><p style={{ fontSize: 18, fontStyle: "italic" }}>No products in this category yet.</p></div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(264px, 1fr))", gap: 24 }}>
                {filtered.map((product, idx) => (
                  <div key={product.id} className="product-card fade-up" style={{ background: "#fff", borderRadius: 10, overflow: "hidden", border: "1px solid #e7e5e4", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", animationDelay: `${idx * 0.07}s` }} onClick={() => setSelectedProduct(product)}>
                    <div style={{ position: "relative" }}><Badge text={product.badge}/><MiniPlaceholder product={product}/></div>
                    <div style={{ padding: "16px 20px 20px" }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#c2410c", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6, fontWeight: 500 }}>{product.category} · {product.detail} Detail</div>
                      <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: "#1a1a2e" }}>{product.name}</h3>
                      <p style={{ fontSize: 13, color: "#a8a29e", lineHeight: 1.5, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>{product.desc.slice(0, 80)}…</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 500, color: "#1a1a2e" }}>${product.price.toFixed(2)}</span>
                        <button className="add-btn" onClick={(e) => { e.stopPropagation(); addToCart(product); }} style={{ background: "#fff", border: "1.5px solid #1a1a2e", color: "#1a1a2e", padding: "8px 18px", borderRadius: 6, fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: "0.8px", textTransform: "uppercase", fontWeight: 500 }}>Add to Cart</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <section style={{ marginTop: 80 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "4px", color: "#c2410c", textTransform: "uppercase", marginBottom: 12, textAlign: "center", fontWeight: 500 }}>Customer Reviews</div>
              <h2 style={{ fontSize: 38, textAlign: "center", marginBottom: 40, fontWeight: 700 }}>What Hobbyists Say</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                {REVIEWS.map((r, i) => (
                  <div key={i} style={{ padding: 28, background: "#fff", borderRadius: 10, border: "1px solid #e7e5e4", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                    <div style={{ display: "flex", gap: 2, marginBottom: 14, color: "#c2410c" }}>{Array.from({length: 5}).map((_, j) => <StarIcon key={j} filled={j < r.rating}/>)}</div>
                    <p style={{ fontSize: 16, lineHeight: 1.7, color: "#57534e", marginBottom: 14, fontStyle: "italic" }}>"{r.text}"</p>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#a8a29e", letterSpacing: "1px", fontWeight: 500 }}>— {r.name}</div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
        {currentSection === "about" && (
          <div className="fade-up" style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "4px", color: "#c2410c", textTransform: "uppercase", marginBottom: 12, fontWeight: 500 }}>Our Story</div>
            <h2 style={{ fontSize: 44, marginBottom: 24, fontWeight: 700 }}>{siteText.aboutTitle}</h2>
            <div style={{ fontSize: 17, lineHeight: 1.9, color: "#78716c" }}>
              <p style={{ marginBottom: 20 }}>{siteText.aboutP1}</p><p style={{ marginBottom: 20 }}>{siteText.aboutP2}</p><p>{siteText.aboutP3}</p>
            </div>
          </div>
        )}
        {currentSection === "faq" && (
          <div className="fade-up" style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "4px", color: "#c2410c", textTransform: "uppercase", marginBottom: 12, fontWeight: 500 }}>FAQ</div>
            <h2 style={{ fontSize: 44, marginBottom: 32, fontWeight: 700 }}>Common Questions</h2>
            {faqs.map((item, i) => (
              <details key={i} style={{ borderBottom: "1px solid #e7e5e4", padding: "20px 0" }}>
                <summary style={{ cursor: "pointer", fontSize: 18, fontWeight: 600, color: "#1a1a2e", listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>{item.q} <ChevronDown/></summary>
                <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.7, color: "#78716c" }}>{item.a}</p>
              </details>
            ))}
          </div>
        )}
      </main>

      <footer style={{ borderTop: "1px solid #e7e5e4", padding: "40px 24px", textAlign: "center", background: "#fff" }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#a8a29e", letterSpacing: "1px" }}>{siteText.footerText}</div>
      </footer>

      {/* CART DRAWER */}
      {cartOpen && (
        <>
          <div className="overlay" onClick={() => setCartOpen(false)} style={{ animation: "fadeIn 0.2s ease" }}/>
          <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: "min(400px, 90vw)", background: "#fff", zIndex: 101, borderLeft: "1px solid #e7e5e4", display: "flex", flexDirection: "column", animation: "slideIn 0.3s ease", boxShadow: "-8px 0 30px rgba(0,0,0,0.06)" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #e7e5e4", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: 22, fontWeight: 700 }}>Your Cart ({cartCount})</h3>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", color: "#a8a29e", cursor: "pointer" }}><XIcon/></button>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 0", color: "#a8a29e" }}>
                  <p style={{ fontSize: 16, marginBottom: 8, fontStyle: "italic" }}>Your cart is empty</p>
                  <p style={{ fontSize: 13, fontFamily: "'DM Mono', monospace" }}>Time to browse some minis!</p>
                </div>
              ) : cart.map(item => (
                <div key={item.id} style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid #f5f5f4" }}>
                  <div style={{ width: 64, height: 64, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}><MiniPlaceholder product={item}/></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#c2410c", fontWeight: 500 }}>${(item.price * item.qty).toFixed(2)}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                      <button onClick={() => updateQty(item.id, -1)} style={{ background: "#f5f5f4", border: "1px solid #e7e5e4", color: "#78716c", width: 28, height: 28, borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><MinusIcon/></button>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, minWidth: 20, textAlign: "center", fontWeight: 500 }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} style={{ background: "#f5f5f4", border: "1px solid #e7e5e4", color: "#78716c", width: 28, height: 28, borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><PlusIcon/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ padding: "20px 24px", borderTop: "1px solid #e7e5e4" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>
                  <span style={{ color: "#a8a29e", fontSize: 12, textTransform: "uppercase", letterSpacing: "1.5px" }}>Total</span>
                  <span style={{ fontSize: 22, fontWeight: 500, color: "#1a1a2e" }}>${cartTotal.toFixed(2)}</span>
                </div>
                <button onClick={() => setCheckoutOpen(true)} style={{ width: "100%", padding: "14px", background: "#c2410c", color: "#fff", border: "none", borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer" }}>Checkout</button>
              </div>
            )}
          </div>
        </>
      )}

      {/* CHECKOUT */}
      {checkoutOpen && <CheckoutModal total={cartTotal} cart={cart} onClose={() => setCheckoutOpen(false)} onComplete={handleCheckoutComplete}/>}

      {/* PRODUCT DETAIL */}
      {selectedProduct && (
        <>
          <div className="overlay" onClick={() => setSelectedProduct(null)}/>
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(600px, 92vw)", maxHeight: "85vh", overflowY: "auto", background: "#fff", borderRadius: 12, zIndex: 101, border: "1px solid #e7e5e4", animation: "fadeUp 0.3s ease", boxShadow: "0 25px 60px rgba(0,0,0,0.1)" }}>
            <div style={{ position: "relative" }}>
              <Badge text={selectedProduct.badge}/><MiniPlaceholder product={selectedProduct}/>
              <button onClick={() => setSelectedProduct(null)} style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.85)", border: "none", color: "#78716c", cursor: "pointer", borderRadius: 6, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}><XIcon/></button>
            </div>
            <div style={{ padding: "24px 28px 28px" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#c2410c", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>{selectedProduct.category} · {selectedProduct.scale} · {selectedProduct.detail} Detail</div>
              <h2 style={{ fontSize: 30, marginBottom: 12, fontWeight: 700 }}>{selectedProduct.name}</h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#78716c", marginBottom: 24 }}>{selectedProduct.desc}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 500 }}>${selectedProduct.price.toFixed(2)}</span>
                <button className="add-btn" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} style={{ background: "#c2410c", border: "none", color: "#fff", padding: "12px 30px", borderRadius: 8, fontSize: 12, fontFamily: "'DM Mono', monospace", fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer" }}>Add to Cart</button>
              </div>
            </div>
          </div>
        </>
      )}

      {toast && <div className="toast-anim" style={{ position: "fixed", bottom: 24, left: "50%", background: "#1a1a2e", color: "#fff", padding: "12px 28px", borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, letterSpacing: "0.5px", zIndex: 200, boxShadow: "0 8px 30px rgba(0,0,0,0.15)" }}>{toast}</div>}
    </div>
  );
}

// ==================== CHECKOUT MODAL (with PayPal) ====================
function CheckoutModal({ total, cart, onClose, onComplete }) {
  const [info, setInfo] = useState({ name: "", email: "", address: "", notes: "" });
  const [step, setStep] = useState("info"); // "info" → "pay" → "done"
  const [payError, setPayError] = useState("");
  const canProceed = info.name && info.email && info.address;

  const handlePayPalSuccess = (details) => {
    setStep("done");
    onComplete(info, details);
  };

  return (
    <>
      <div className="overlay" onClick={onClose}/>
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(500px, 92vw)", maxHeight: "85vh", overflowY: "auto", background: "#fff", borderRadius: 12, zIndex: 102, border: "1px solid #e7e5e4", animation: "fadeUp 0.3s ease", boxShadow: "0 25px 60px rgba(0,0,0,0.1)", padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>{step === "info" ? "Checkout" : step === "pay" ? "Payment" : "Order Confirmed!"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#a8a29e", cursor: "pointer" }}><XIcon/></button>
        </div>

        {step === "info" && (
          <>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <InputField label="Full Name" value={info.name} onChange={(v) => setInfo({...info, name: v})}/>
              <InputField label="Email" type="email" value={info.email} onChange={(v) => setInfo({...info, email: v})}/>
              <InputField label="Shipping Address" value={info.address} onChange={(v) => setInfo({...info, address: v})} multiline/>
              <InputField label="Order Notes (optional)" value={info.notes} onChange={(v) => setInfo({...info, notes: v})} multiline/>
            </div>
            <div style={{ marginTop: 20, padding: "14px 0", borderTop: "1px solid #e7e5e4" }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#a8a29e", marginBottom: 8, textTransform: "uppercase", letterSpacing: "1.5px" }}>Order Summary</div>
              {cart.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "4px 0", fontFamily: "'DM Mono', monospace" }}>
                  <span>{item.name} × {item.qty}</span>
                  <span>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, padding: "12px 0", borderTop: "1px solid #e7e5e4", fontFamily: "'DM Mono', monospace" }}>
                <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "1.5px", color: "#a8a29e" }}>Total</span>
                <span style={{ fontSize: 24, fontWeight: 500 }}>${total.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={() => canProceed && setStep("pay")} disabled={!canProceed} style={{ width: "100%", marginTop: 16, padding: "14px", background: canProceed ? "#c2410c" : "#d6d3d1", color: "#fff", border: "none", borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", cursor: canProceed ? "pointer" : "not-allowed" }}>Continue to Payment</button>
          </>
        )}

        {step === "pay" && (
          <>
            <p style={{ fontSize: 14, color: "#78716c", marginBottom: 8 }}>
              Shipping to: <strong style={{ color: "#1a1a2e" }}>{info.name}</strong> — {info.address}
            </p>
            <button onClick={() => setStep("info")} style={{ background: "none", border: "none", color: "#c2410c", fontFamily: "'DM Mono', monospace", fontSize: 11, cursor: "pointer", marginBottom: 16, padding: 0, textDecoration: "underline" }}>← Edit details</button>
            <div style={{ padding: "16px 0", borderTop: "1px solid #e7e5e4", borderBottom: "1px solid #e7e5e4", marginBottom: 16, display: "flex", justifyContent: "space-between", fontFamily: "'DM Mono', monospace" }}>
              <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "1.5px", color: "#a8a29e" }}>Total</span>
              <span style={{ fontSize: 24, fontWeight: 500 }}>${total.toFixed(2)}</span>
            </div>
            {PAYPAL_CLIENT_ID === "sb" && (
              <div style={{ background: "#fef3c7", border: "1px solid #fde68a", borderRadius: 6, padding: 12, marginBottom: 12, fontSize: 12, fontFamily: "'DM Mono', monospace", color: "#92400e" }}>
                PayPal is in TEST mode. No real money will be charged. To accept real payments, add your PayPal Client ID in the code.
              </div>
            )}
            {payError && <div style={{ color: "#ef4444", fontSize: 13, fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>{payError}</div>}
            <PayPalButton total={total} currency={CURRENCY} onSuccess={handlePayPalSuccess} onError={(msg) => setPayError(msg)}/>
          </>
        )}

        {step === "done" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
            <p style={{ fontSize: 17, color: "#1a1a2e", fontWeight: 600, marginBottom: 8 }}>Thank you for your order!</p>
            <p style={{ fontSize: 14, color: "#78716c", fontFamily: "'DM Mono', monospace", marginBottom: 20 }}>A confirmation will be sent to {info.email}</p>
            <button onClick={onClose} style={{ padding: "12px 30px", background: "#c2410c", color: "#fff", border: "none", borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer" }}>Close</button>
          </div>
        )}
      </div>
    </>
  );
}

function InputField({ label, value, onChange, type = "text", multiline }) {
  const Tag = multiline ? "textarea" : "input";
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", color: "#78716c", fontWeight: 500 }}>{label}</span>
      <Tag type={type} value={value} onChange={(e) => onChange(e.target.value)} rows={multiline ? 3 : undefined} style={{ padding: "10px 14px", border: "1px solid #e7e5e4", borderRadius: 6, fontSize: 15, fontFamily: multiline ? "'DM Mono', monospace" : "'Playfair Display', serif", background: "#fafaf9", color: "#1a1a2e", outline: "none", resize: multiline ? "vertical" : "none" }}/>
    </label>
  );
}
function SelectField({ label, value, options, onChange, displayEmpty }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", color: "#78716c", fontWeight: 500 }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ padding: "10px 14px", border: "1px solid #e7e5e4", borderRadius: 6, fontSize: 15, fontFamily: "'Playfair Display', serif", background: "#fafaf9", color: "#1a1a2e", outline: "none", cursor: "pointer" }}>
        {options.map(o => <option key={o} value={o}>{o === "" ? (displayEmpty || "—") : o}</option>)}
      </select>
    </label>
  );
}

// ==================== ADMIN PANEL ====================
function AdminPanel({ products, setProducts, siteText, setSiteText, faqs, setFaqs, orders, setOrders, categories, setCategories }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("fr_admin_auth") === "yes");
  const [tab, setTab] = useState("products");

  if (!authed) return <LoginScreen onSuccess={() => { sessionStorage.setItem("fr_admin_auth", "yes"); setAuthed(true); }}/>;
  const logout = () => { sessionStorage.removeItem("fr_admin_auth"); setAuthed(false); };

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf9", fontFamily: "'Playfair Display', Georgia, serif", color: "#1a1a2e" }}>
      <style>{globalStyles}</style>
      <nav style={{ background: "#1a1a2e", color: "#fff", padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="24" height="24" viewBox="0 0 32 32"><polygon points="16,2 28,10 28,22 16,30 4,22 4,10" fill="none" stroke="#c2410c" strokeWidth="1.5"/><circle cx="16" cy="16" r="3" fill="#c2410c"/></svg>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Admin Panel</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#888", letterSpacing: "1.5px", textTransform: "uppercase", marginLeft: 8 }}>Forge & Resin</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ""; window.location.reload(); }} style={{ color: "#a8a29e", textDecoration: "none", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", padding: "6px 12px" }}>View Site</a>
          <button onClick={logout} style={{ background: "transparent", border: "1px solid #c2410c", color: "#c2410c", padding: "6px 14px", borderRadius: 4, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase" }}><LogOutIcon/> Logout</button>
        </div>
      </nav>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid #e7e5e4", flexWrap: "wrap" }}>
          {[{ id: "products", label: "Products" }, { id: "orders", label: `Orders (${orders.length})` }, { id: "categories", label: "Categories" }, { id: "site", label: "Site Text" }, { id: "faqs", label: "FAQ" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "12px 20px", background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "1.2px", textTransform: "uppercase", color: tab === t.id ? "#c2410c" : "#78716c", fontWeight: tab === t.id ? 600 : 400, borderBottom: tab === t.id ? "2px solid #c2410c" : "2px solid transparent", marginBottom: -1 }}>{t.label}</button>
          ))}
        </div>
        {tab === "products" && <ProductsTab products={products} setProducts={setProducts} categories={categories}/>}
        {tab === "orders" && <OrdersTab orders={orders} setOrders={setOrders}/>}
        {tab === "categories" && <CategoriesTab categories={categories} setCategories={setCategories} products={products} setProducts={setProducts}/>}
        {tab === "site" && <SiteTextTab siteText={siteText} setSiteText={setSiteText}/>}
        {tab === "faqs" && <FaqsTab faqs={faqs} setFaqs={setFaqs}/>}
      </div>
    </div>
  );
}

function LoginScreen({ onSuccess }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const tryLogin = () => { if (pw === ADMIN_PASSWORD) onSuccess(); else setErr("Incorrect password"); };
  return (
    <div style={{ minHeight: "100vh", background: "#fafaf9", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'Playfair Display', serif" }}>
      <style>{globalStyles}</style>
      <div style={{ background: "#fff", padding: 40, borderRadius: 12, border: "1px solid #e7e5e4", boxShadow: "0 20px 50px rgba(0,0,0,0.06)", width: "min(400px, 100%)", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: "50%", background: "#fafaf9", color: "#c2410c", marginBottom: 20 }}><LockIcon/></div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Admin Access</h1>
        <p style={{ fontSize: 13, color: "#a8a29e", fontFamily: "'DM Mono', monospace", marginBottom: 24 }}>Enter password to continue</p>
        <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setErr(""); }} onKeyDown={(e) => e.key === "Enter" && tryLogin()} placeholder="Password" style={{ width: "100%", padding: "12px 16px", border: `1px solid ${err ? "#ef4444" : "#e7e5e4"}`, borderRadius: 8, fontSize: 16, background: "#fafaf9", outline: "none", marginBottom: 12, textAlign: "center", fontFamily: "'DM Mono', monospace", letterSpacing: "2px" }}/>
        {err && <div style={{ color: "#ef4444", fontSize: 13, fontFamily: "'DM Mono', monospace", marginBottom: 12 }}>{err}</div>}
        <button onClick={tryLogin} style={{ width: "100%", padding: 14, background: "#c2410c", color: "#fff", border: "none", borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer" }}>Unlock</button>
        <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = ""; window.location.reload(); }} style={{ display: "block", marginTop: 16, color: "#a8a29e", fontSize: 12, textDecoration: "none", fontFamily: "'DM Mono', monospace" }}>← Back to shop</a>
      </div>
    </div>
  );
}

// ==================== PRODUCTS TAB (with quick category dropdown) ====================
function ProductsTab({ products, setProducts, categories }) {
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const save = (product) => {
    if (product.id) setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    else { const newId = Math.max(0, ...products.map(p => p.id)) + 1; setProducts(prev => [...prev, { ...product, id: newId }]); }
    setEditing(null); setShowForm(false);
  };
  const del = (id) => { if (confirm("Delete this product?")) setProducts(prev => prev.filter(p => p.id !== id)); };
  const quickCategory = (id, cat) => { setProducts(prev => prev.map(p => p.id === id ? {...p, category: cat} : p)); };
  const defaultCat = categories[0] || "Uncategorized";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Products ({products.length})</h2>
        <button onClick={() => { setEditing({ name: "", category: defaultCat, price: 0, scale: "32mm", detail: "High", badge: "", desc: "", image: "" }); setShowForm(true); }} style={{ background: "#c2410c", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 6, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" }}>+ Add Product</button>
      </div>
      {showForm && <ProductForm initial={editing} categories={categories} onSave={save} onCancel={() => { setEditing(null); setShowForm(false); }}/>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {products.map(p => (
          <div key={p.id} style={{ background: "#fff", border: "1px solid #e7e5e4", borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ position: "relative", height: 180, overflow: "hidden" }}><Badge text={p.badge}/><MiniPlaceholder product={p}/></div>
            <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{p.name}</h3>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 15, fontWeight: 500, marginBottom: 8 }}>${p.price.toFixed(2)}</div>
              {/* QUICK CATEGORY DROPDOWN */}
              <div style={{ marginBottom: 12 }}>
                <select value={p.category} onChange={(e) => quickCategory(p.id, e.target.value)} style={{ padding: "5px 10px", border: "1px solid #e7e5e4", borderRadius: 4, fontFamily: "'DM Mono', monospace", fontSize: 11, background: "#fafaf9", color: "#c2410c", cursor: "pointer", fontWeight: 500 }}>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  {!categories.includes(p.category) && <option value={p.category}>{p.category} (unlisted)</option>}
                </select>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: "auto" }}>
                <button onClick={() => { setEditing(p); setShowForm(true); }} style={{ flex: 1, padding: "8px", background: "#fafaf9", border: "1px solid #e7e5e4", borderRadius: 6, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#1a1a2e" }}><EditIcon/> Edit</button>
                <button onClick={() => del(p.id)} style={{ flex: 1, padding: "8px", background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", borderRadius: 6, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><TrashIcon/> Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductForm({ initial, categories, onSave, onCancel }) {
  const [form, setForm] = useState(initial);
  const canSave = form.name && form.desc && form.price >= 0;
  return (
    <>
      <div className="overlay" onClick={onCancel}/>
      <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "min(560px, 94vw)", maxHeight: "90vh", overflowY: "auto", background: "#fff", borderRadius: 12, zIndex: 102, padding: 28, boxShadow: "0 25px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>{initial.id ? "Edit Product" : "New Product"}</h2>
          <button onClick={onCancel} style={{ background: "none", border: "none", cursor: "pointer", color: "#a8a29e" }}><XIcon/></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <InputField label="Name" value={form.name} onChange={(v) => setForm({...form, name: v})}/>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <SelectField label="Category" value={form.category} options={categories} onChange={(v) => setForm({...form, category: v})}/>
            <InputField label="Price (AUD)" type="number" value={form.price} onChange={(v) => setForm({...form, price: parseFloat(v) || 0})}/>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <InputField label="Scale" value={form.scale} onChange={(v) => setForm({...form, scale: v})}/>
            <SelectField label="Detail" value={form.detail} options={DETAIL_LEVELS} onChange={(v) => setForm({...form, detail: v})}/>
            <SelectField label="Badge" value={form.badge} options={BADGE_OPTIONS} displayEmpty="None" onChange={(v) => setForm({...form, badge: v})}/>
          </div>
          <InputField label="Image URL (paste from Imgur, Google Drive, etc.)" value={form.image} onChange={(v) => setForm({...form, image: v})}/>
          {form.image && <div style={{ border: "1px solid #e7e5e4", borderRadius: 6, overflow: "hidden", background: "#fafaf9" }}>
            <img src={form.image} alt="preview" style={{ width: "100%", maxHeight: 200, objectFit: "contain", display: "block" }} onError={(e) => { e.target.style.display = "none"; }}/>
          </div>}
          <InputField label="Description" value={form.desc} onChange={(v) => setForm({...form, desc: v})} multiline/>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: 12, background: "#fafaf9", border: "1px solid #e7e5e4", borderRadius: 6, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "1.5px", textTransform: "uppercase" }}>Cancel</button>
          <button onClick={() => canSave && onSave(form)} disabled={!canSave} style={{ flex: 1, padding: 12, background: canSave ? "#c2410c" : "#d6d3d1", color: "#fff", border: "none", borderRadius: 6, cursor: canSave ? "pointer" : "not-allowed", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 500 }}>Save Product</button>
        </div>
      </div>
    </>
  );
}

// ==================== ORDERS TAB ====================
function OrdersTab({ orders, setOrders }) {
  if (orders.length === 0) return (
    <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 12, border: "1px solid #e7e5e4" }}>
      <h3 style={{ fontSize: 22, marginBottom: 8 }}>No orders yet</h3>
      <p style={{ color: "#a8a29e", fontFamily: "'DM Mono', monospace", fontSize: 13 }}>Orders will appear here when customers checkout.</p>
    </div>
  );
  const updateStatus = (id, status) => setOrders(prev => prev.map(o => o.id === id ? {...o, status} : o));
  const statusColors = { pending: "#fef3c7", paid: "#dcfce7", shipped: "#dbeafe", delivered: "#f0fdf4", cancelled: "#fee2e2" };

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Orders ({orders.length})</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {orders.map(order => (
          <div key={order.id} style={{ background: "#fff", border: "1px solid #e7e5e4", borderRadius: 8, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#a8a29e", letterSpacing: "1.5px", textTransform: "uppercase" }}>Order #{order.id}</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{order.customer.name}</div>
                <div style={{ fontSize: 13, color: "#78716c", fontFamily: "'DM Mono', monospace" }}>{order.customer.email}</div>
                <div style={{ fontSize: 13, color: "#a8a29e", marginTop: 4, fontFamily: "'DM Mono', monospace" }}>{new Date(order.date).toLocaleString()}</div>
                {order.paypal && <div style={{ fontSize: 11, color: "#166534", fontFamily: "'DM Mono', monospace", marginTop: 4, background: "#dcfce7", display: "inline-block", padding: "2px 8px", borderRadius: 4 }}>PayPal: {order.paypal.id}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 22, fontWeight: 500 }}>${order.total.toFixed(2)}</div>
                <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} style={{ marginTop: 6, padding: "4px 10px", border: "1px solid #e7e5e4", borderRadius: 4, fontFamily: "'DM Mono', monospace", fontSize: 11, background: statusColors[order.status] || "#fafaf9", cursor: "pointer" }}>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div style={{ padding: "12px 0", borderTop: "1px solid #f5f5f4", fontSize: 13, color: "#78716c", fontFamily: "'DM Mono', monospace" }}>
              <strong style={{ color: "#1a1a2e" }}>Ship to:</strong> {order.customer.address}
              {order.customer.notes && <><br/><strong style={{ color: "#1a1a2e" }}>Notes:</strong> {order.customer.notes}</>}
            </div>
            <div style={{ borderTop: "1px solid #f5f5f4", paddingTop: 12 }}>
              {order.items.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "4px 0" }}>
                  <span>{item.name} × {item.qty}</span>
                  <span style={{ fontFamily: "'DM Mono', monospace" }}>${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== CATEGORIES TAB ====================
function CategoriesTab({ categories, setCategories, products, setProducts }) {
  const [newCat, setNewCat] = useState("");
  const [editingIdx, setEditingIdx] = useState(null);
  const [editValue, setEditValue] = useState("");

  const add = () => {
    const trimmed = newCat.trim();
    if (!trimmed || categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) return;
    setCategories(prev => [...prev, trimmed]);
    setNewCat("");
  };
  const startEdit = (idx) => { setEditingIdx(idx); setEditValue(categories[idx]); };
  const saveEdit = (idx) => {
    const trimmed = editValue.trim();
    if (!trimmed) { setEditingIdx(null); return; }
    const oldName = categories[idx];
    if (trimmed === oldName) { setEditingIdx(null); return; }
    if (categories.some((c, i) => i !== idx && c.toLowerCase() === trimmed.toLowerCase())) return;
    setCategories(prev => prev.map((c, i) => i === idx ? trimmed : c));
    setProducts(prev => prev.map(p => p.category === oldName ? { ...p, category: trimmed } : p));
    setEditingIdx(null);
  };
  const remove = (idx) => {
    const name = categories[idx];
    const count = products.filter(p => p.category === name).length;
    const fallback = categories.find(c => c !== name) || "Uncategorized";
    if (!confirm(`Delete "${name}"?${count > 0 ? ` ${count} product(s) will move to "${fallback}".` : ""}`)) return;
    setCategories(prev => prev.filter((_, i) => i !== idx));
    setProducts(prev => prev.map(p => p.category === name ? { ...p, category: fallback } : p));
  };
  const move = (idx, dir) => {
    const n = idx + dir;
    if (n < 0 || n >= categories.length) return;
    setCategories(prev => { const a = [...prev]; [a[idx], a[n]] = [a[n], a[idx]]; return a; });
  };

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20 }}>Categories ({categories.length})</h2>
      <div style={{ background: "#fff", borderRadius: 8, padding: 20, border: "1px solid #e7e5e4", marginBottom: 16 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", color: "#78716c", fontWeight: 500, marginBottom: 8 }}>Add New Category</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={newCat} onChange={(e) => setNewCat(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="e.g. Vehicles" style={{ flex: 1, padding: "10px 14px", border: "1px solid #e7e5e4", borderRadius: 6, fontSize: 15, fontFamily: "'Playfair Display', serif", background: "#fafaf9", color: "#1a1a2e", outline: "none" }}/>
          <button onClick={add} style={{ background: "#c2410c", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 6, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" }}>+ Add</button>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e7e5e4", overflow: "hidden" }}>
        {categories.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#a8a29e", fontFamily: "'DM Mono', monospace", fontSize: 13 }}>No categories yet.</div>
        ) : categories.map((cat, i) => {
          const count = products.filter(p => p.category === cat).length;
          return (
            <div key={cat + i} style={{ padding: "14px 20px", borderBottom: i < categories.length - 1 ? "1px solid #f5f5f4" : "none", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <button onClick={() => move(i, -1)} disabled={i === 0} style={{ background: "none", border: "none", cursor: i === 0 ? "not-allowed" : "pointer", padding: 2, opacity: i === 0 ? 0.3 : 0.6, fontSize: 12 }}>▲</button>
                <button onClick={() => move(i, 1)} disabled={i === categories.length - 1} style={{ background: "none", border: "none", cursor: i === categories.length - 1 ? "not-allowed" : "pointer", padding: 2, opacity: i === categories.length - 1 ? 0.3 : 0.6, fontSize: 12 }}>▼</button>
              </div>
              {editingIdx === i ? (
                <input autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") saveEdit(i); if (e.key === "Escape") setEditingIdx(null); }} onBlur={() => saveEdit(i)} style={{ flex: 1, padding: "6px 10px", border: "1px solid #c2410c", borderRadius: 4, fontSize: 15, fontFamily: "'Playfair Display', serif", background: "#fff", color: "#1a1a2e", outline: "none", minWidth: 120 }}/>
              ) : (
                <div style={{ flex: 1, minWidth: 120 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#1a1a2e" }}>{cat}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#a8a29e", marginTop: 2 }}>{count} product{count !== 1 ? "s" : ""}</div>
                </div>
              )}
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => startEdit(i)} style={{ padding: "6px 12px", background: "#fafaf9", border: "1px solid #e7e5e4", borderRadius: 4, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11, display: "flex", alignItems: "center", gap: 6, color: "#1a1a2e" }}><EditIcon/> Rename</button>
                <button onClick={() => remove(i)} style={{ padding: "6px 12px", background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", borderRadius: 4, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}><TrashIcon/> Delete</button>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 16, padding: 16, background: "#fafaf9", borderRadius: 6, border: "1px solid #e7e5e4", fontSize: 13, color: "#78716c", fontFamily: "'DM Mono', monospace", lineHeight: 1.6 }}>
        <strong style={{ color: "#1a1a2e" }}>Tips:</strong><br/>• Renaming updates all products automatically<br/>• Deleting moves products to the first remaining category<br/>• Arrows reorder the shop filter bar
      </div>
    </div>
  );
}

// ==================== SITE TEXT TAB ====================
function SiteTextTab({ siteText, setSiteText }) {
  const [form, setForm] = useState(siteText);
  const [saved, setSaved] = useState(false);
  const save = () => { setSiteText(form); setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>Site Text</h2>
        <button onClick={save} style={{ background: saved ? "#22c55e" : "#c2410c", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 6, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 500 }}>{saved ? "✓ Saved" : "Save Changes"}</button>
      </div>
      <div style={{ background: "#fff", borderRadius: 8, padding: 24, border: "1px solid #e7e5e4", marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, marginBottom: 16, fontFamily: "'DM Mono', monospace", letterSpacing: "1.5px", textTransform: "uppercase", color: "#c2410c" }}>Hero Section</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <InputField label="Tagline" value={form.heroTagline} onChange={(v) => setForm({...form, heroTagline: v})}/>
          <InputField label="Title — Line 1" value={form.heroTitleLine1} onChange={(v) => setForm({...form, heroTitleLine1: v})}/>
          <InputField label="Title — Line 2 (orange italic)" value={form.heroTitleLine2} onChange={(v) => setForm({...form, heroTitleLine2: v})}/>
          <InputField label="Subtitle" value={form.heroSubtitle} onChange={(v) => setForm({...form, heroSubtitle: v})} multiline/>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 8, padding: 24, border: "1px solid #e7e5e4", marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, marginBottom: 16, fontFamily: "'DM Mono', monospace", letterSpacing: "1.5px", textTransform: "uppercase", color: "#c2410c" }}>Stat Boxes</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {[1,2,3].map(i => (<div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}><InputField label={`Stat ${i} Value`} value={form[`stat${i}Value`]} onChange={(v) => setForm({...form, [`stat${i}Value`]: v})}/><InputField label={`Stat ${i} Label`} value={form[`stat${i}Label`]} onChange={(v) => setForm({...form, [`stat${i}Label`]: v})}/></div>))}
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 8, padding: 24, border: "1px solid #e7e5e4", marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, marginBottom: 16, fontFamily: "'DM Mono', monospace", letterSpacing: "1.5px", textTransform: "uppercase", color: "#c2410c" }}>About Page</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <InputField label="Title" value={form.aboutTitle} onChange={(v) => setForm({...form, aboutTitle: v})}/>
          <InputField label="Paragraph 1" value={form.aboutP1} onChange={(v) => setForm({...form, aboutP1: v})} multiline/>
          <InputField label="Paragraph 2" value={form.aboutP2} onChange={(v) => setForm({...form, aboutP2: v})} multiline/>
          <InputField label="Paragraph 3" value={form.aboutP3} onChange={(v) => setForm({...form, aboutP3: v})} multiline/>
        </div>
      </div>
      <div style={{ background: "#fff", borderRadius: 8, padding: 24, border: "1px solid #e7e5e4" }}>
        <h3 style={{ fontSize: 16, marginBottom: 16, fontFamily: "'DM Mono', monospace", letterSpacing: "1.5px", textTransform: "uppercase", color: "#c2410c" }}>Footer</h3>
        <InputField label="Footer Text" value={form.footerText} onChange={(v) => setForm({...form, footerText: v})}/>
      </div>
    </div>
  );
}

// ==================== FAQ TAB ====================
function FaqsTab({ faqs, setFaqs }) {
  const update = (idx, field, value) => setFaqs(prev => prev.map((item, i) => i === idx ? {...item, [field]: value} : item));
  const add = () => setFaqs(prev => [...prev, { q: "New question?", a: "Answer goes here." }]);
  const remove = (idx) => { if (confirm("Delete this FAQ?")) setFaqs(prev => prev.filter((_, i) => i !== idx)); };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700 }}>FAQ ({faqs.length})</h2>
        <button onClick={add} style={{ background: "#c2410c", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 6, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "1px", textTransform: "uppercase", fontWeight: 500 }}>+ Add FAQ</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {faqs.map((item, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #e7e5e4", borderRadius: 8, padding: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <InputField label="Question" value={item.q} onChange={(v) => update(i, "q", v)}/>
              <InputField label="Answer" value={item.a} onChange={(v) => update(i, "a", v)} multiline/>
            </div>
            <button onClick={() => remove(i)} style={{ marginTop: 12, background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca", padding: "6px 14px", borderRadius: 4, cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "1px", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6 }}><TrashIcon/> Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== GLOBAL STYLES ====================
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { margin: 0; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #f5f5f4; }
  ::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 3px; }
  .product-card { transition: transform 0.3s ease, box-shadow 0.3s ease; cursor: pointer; }
  .product-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04); }
  .cat-btn { transition: all 0.2s ease; cursor: pointer; border: none; }
  .cat-btn:hover { background: #1a1a2e !important; color: #fff !important; }
  .add-btn { transition: all 0.2s ease; cursor: pointer; }
  .add-btn:hover { background: #c2410c !important; color: #fff !important; border-color: #c2410c !important; }
  .overlay { position: fixed; inset: 0; background: rgba(255,255,255,0.6); z-index: 100; backdrop-filter: blur(8px); }
  @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes toastIn { from { transform: translateY(20px) translateX(-50%); opacity: 0; } to { transform: translateY(0) translateX(-50%); opacity: 1; } }
  .fade-up { animation: fadeUp 0.5s ease forwards; opacity: 0; }
  .toast-anim { animation: toastIn 0.3s ease forwards; }
  .nav-link { transition: color 0.2s; cursor: pointer; position: relative; }
  .nav-link:hover { color: #c2410c !important; }
  details summary::-webkit-details-marker { display: none; }
  details summary::marker { display: none; }
  details[open] summary svg { transform: rotate(180deg); }
  details summary svg { transition: transform 0.2s ease; }
  input:focus, textarea:focus, select:focus { border-color: #c2410c !important; }
`;
