import { useState, useEffect, useRef } from "react";

const PRODUCTS = [
  { id: 1, name: "Dragonlord Azareth", category: "Dragons", price: 34.99, scale: "75mm", detail: "Ultra", badge: "Best Seller", desc: "A towering dragon lord perched upon ancient ruins, wings unfurled. Exquisite scale detail and battle-scarred armor." },
  { id: 2, name: "Shadow Assassin", category: "Characters", price: 18.99, scale: "32mm", detail: "High", badge: "New", desc: "A cloaked rogue mid-leap, daggers drawn. Dynamic pose with flowing cape and intricate leather armor texture." },
  { id: 3, name: "Ancient Treant", category: "Monsters", price: 42.99, scale: "100mm", detail: "Ultra", badge: null, desc: "A massive sentient tree awakened to war. Bark texture with embedded runes and moss detail throughout." },
  { id: 4, name: "Paladin of Dawn", category: "Characters", price: 16.99, scale: "32mm", detail: "High", badge: null, desc: "A noble warrior in ornate plate armor raising a blessed warhammer. Flowing tabard with embossed sun emblem." },
  { id: 5, name: "Goblin Warband (x6)", category: "Units", price: 28.99, scale: "28mm", detail: "Standard", badge: "Popular", desc: "Six unique goblin sculpts with varied weapons and expressions. Perfect for tabletop skirmish games." },
  { id: 6, name: "Eldritch Horror", category: "Monsters", price: 54.99, scale: "120mm", detail: "Ultra", badge: "Limited", desc: "A writhing cosmic entity with countless tendrils and eyes. Our most complex print — over 200 hours of sculpting." },
  { id: 7, name: "Dungeon Terrain Set", category: "Terrain", price: 39.99, scale: "28mm", detail: "High", badge: null, desc: "12-piece modular dungeon set: walls, pillars, archways, and a treasure room centerpiece." },
  { id: 8, name: "Necromancer Queen", category: "Characters", price: 22.99, scale: "32mm", detail: "High", badge: "New", desc: "A spectral sorceress hovering above a cracked summoning circle. Ethereal robes and skull-topped staff." },
];

const CATEGORIES = ["All", "Characters", "Dragons", "Monsters", "Units", "Terrain"];

const REVIEWS = [
  { name: "Mike T.", text: "The detail on the Dragonlord is insane. Best resin mini I've ever bought.", rating: 5 },
  { name: "Sarah K.", text: "Fast shipping to Melbourne, prints were flawless. Already ordered more!", rating: 5 },
  { name: "James R.", text: "The terrain set is perfectly scaled. My DnD group was blown away.", rating: 5 },
];

const CartIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
const StarIcon = ({ filled }) => <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const XIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const MinusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const ChevronDown = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>;

const MiniPlaceholder = ({ product }) => {
  const hues = { Dragons: 4, Characters: 230, Monsters: 270, Units: 155, Terrain: 28 };
  const hue = hues[product.category] || 200;

  return (
    <div style={{
      width: "100%", aspectRatio: "1",
      background: `linear-gradient(145deg, hsl(${hue}, 30%, 94%), hsl(${hue}, 25%, 88%))`,
      display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden",
      borderRadius: "6px 6px 0 0"
    }}>
      <div style={{
        position: "absolute", width: "70%", height: "70%", borderRadius: "50%",
        background: `radial-gradient(circle, hsla(${hue}, 50%, 70%, 0.2), transparent 70%)`,
        top: "15%", left: "15%", filter: "blur(25px)"
      }}/>
      <svg width="100%" height="100%" viewBox="0 0 200 200" style={{ position: "absolute", opacity: 0.06 }}>
        {Array.from({length: 10}).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i*20+20} x2="200" y2={i*20+20} stroke={`hsl(${hue},30%,50%)`} strokeWidth="0.5"/>
        ))}
        {Array.from({length: 10}).map((_, i) => (
          <line key={`v${i}`} x1={i*20+20} y1="0" x2={i*20+20} y2="200" stroke={`hsl(${hue},30%,50%)`} strokeWidth="0.5"/>
        ))}
      </svg>
      <svg width="45%" height="45%" viewBox="0 0 100 100" style={{ position: "relative", zIndex: 1, opacity: 0.35 }}>
        {product.category === "Dragons" && (
          <path d="M50 15 L65 35 L80 30 L75 50 L90 55 L70 65 L75 85 L50 75 L25 85 L30 65 L10 55 L25 50 L20 30 L35 35 Z" fill={`hsl(${hue},45%,45%)`}/>
        )}
        {product.category === "Characters" && (
          <g fill={`hsl(${hue},45%,45%)`}>
            <circle cx="50" cy="25" r="10"/><rect x="40" y="35" width="20" height="30" rx="3"/><rect x="35" y="65" width="10" height="22" rx="2"/><rect x="55" y="65" width="10" height="22" rx="2"/>
          </g>
        )}
        {product.category === "Monsters" && (
          <path d="M50 10 Q80 20 85 50 Q90 80 50 90 Q10 80 15 50 Q20 20 50 10 M35 40 L30 25 M65 40 L70 25 M30 60 Q50 80 70 60" fill={`hsl(${hue},45%,45%)`} fillRule="evenodd"/>
        )}
        {product.category === "Units" && (
          <g fill={`hsl(${hue},45%,45%)`}>
            {[30,50,70].map((x,i) => <g key={i}><circle cx={x} cy={30+i*5} r="6"/><rect x={x-5} y={36+i*5} width="10" height="15" rx="2"/></g>)}
          </g>
        )}
        {product.category === "Terrain" && (
          <g fill={`hsl(${hue},45%,45%)`}>
            <rect x="15" y="50" width="70" height="35" rx="2"/><rect x="20" y="30" width="15" height="20" rx="1"/><rect x="55" y="35" width="20" height="15" rx="1"/><rect x="38" y="40" width="12" height="10" rx="1"/>
          </g>
        )}
      </svg>
      <div style={{
        position: "absolute", bottom: 10, right: 10, background: "rgba(255,255,255,0.8)", padding: "3px 8px",
        borderRadius: "4px", fontSize: "11px", color: `hsl(${hue},40%,40%)`, fontFamily: "'DM Mono', monospace",
        letterSpacing: "0.5px", backdropFilter: "blur(4px)"
      }}>{product.scale}</div>
    </div>
  );
};

const Badge = ({ text }) => {
  const colors = {
    "Best Seller": { bg: "#fef3c7", color: "#92400e", border: "#fde68a" },
    "New": { bg: "#dcfce7", color: "#166534", border: "#bbf7d0" },
    "Popular": { bg: "#dbeafe", color: "#1e40af", border: "#bfdbfe" },
    "Limited": { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" },
  };
  const c = colors[text] || colors["New"];
  return (
    <span style={{
      position: "absolute", top: 10, left: 10, padding: "3px 10px", fontSize: "10px",
      fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px",
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      borderRadius: "4px", fontFamily: "'DM Mono', monospace", zIndex: 2
    }}>{text}</span>
  );
};

export default function MiniatureShop() {
  const [cart, setCart] = useState([]);
  const [category, setCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentSection, setCurrentSection] = useState("shop");
  const toastTimeout = useRef(null);

  const filtered = category === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === category);
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
    toastTimeout.current = setTimeout(() => setToast(null), 2200);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#fafaf9", color: "#1a1a2e",
      fontFamily: "'Playfair Display', Georgia, serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f5f5f4; }
        ::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 3px; }
        .product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .product-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04);
        }
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
      `}</style>

      {/* NAVIGATION */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50, background: "rgba(250,250,249,0.9)",
        backdropFilter: "blur(16px)", borderBottom: "1px solid #e7e5e4"
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between", height: 68
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="30" height="30" viewBox="0 0 32 32">
              <polygon points="16,2 28,10 28,22 16,30 4,22 4,10" fill="none" stroke="#1a1a2e" strokeWidth="1.5"/>
              <polygon points="16,8 22,12 22,20 16,24 10,20 10,12" fill="#c2410c" opacity="0.2"/>
              <circle cx="16" cy="16" r="3" fill="#c2410c"/>
            </svg>
            <span style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 800, fontSize: 21,
              color: "#1a1a2e", letterSpacing: "1px"
            }}>Forge & Resin</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {["shop", "about", "faq"].map(s => (
              <span key={s} className="nav-link" onClick={() => setCurrentSection(s)} style={{
                fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: currentSection === s ? "#c2410c" : "#78716c",
                fontWeight: currentSection === s ? 500 : 400,
              }}>{s}</span>
            ))}
            <button onClick={() => setCartOpen(true)} style={{
              background: "#1a1a2e", border: "none", borderRadius: 6,
              color: "#fff", padding: "8px 16px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              fontFamily: "'DM Mono', monospace", fontSize: 12
            }}>
              <CartIcon/>
              {cartCount > 0 && <span style={{
                background: "#c2410c", color: "#fff", borderRadius: "50%",
                width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700
              }}>{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      {currentSection === "shop" && (
        <header style={{
          position: "relative", overflow: "hidden", padding: "80px 24px 72px",
          textAlign: "center", background: "#fff"
        }}>
          <div style={{
            position: "absolute", inset: 0, opacity: 0.35,
            backgroundImage: "radial-gradient(circle, #d6d3d1 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}/>
          <div style={{
            position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)",
            width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(194,65,12,0.06), transparent 65%)"
          }}/>
          <div className="fade-up" style={{ position: "relative", zIndex: 1 }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "4px",
              color: "#c2410c", textTransform: "uppercase", marginBottom: 16, fontWeight: 500
            }}>Precision 3D Resin Printing</div>
            <h1 style={{
              fontSize: "clamp(38px, 6vw, 68px)", fontWeight: 800, lineHeight: 1.08,
              color: "#1a1a2e", marginBottom: 18
            }}>
              Miniatures Forged<br/>
              <span style={{ color: "#c2410c", fontStyle: "italic" }}>in Light & Resin</span>
            </h1>
            <p style={{
              fontSize: 18, color: "#a8a29e", maxWidth: 480, margin: "0 auto 36px",
              fontStyle: "italic", lineHeight: 1.6
            }}>
              Hand-supported, cured, and inspected. Every layer matters.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { label: "0.03mm", sub: "Layer Height" },
                { label: "8K", sub: "LCD Resolution" },
                { label: "48hr", sub: "Avg. Ship Time" }
              ].map((s, i) => (
                <div key={i} style={{
                  padding: "16px 28px", border: "1px solid #e7e5e4",
                  borderRadius: 8, background: "#fafaf9"
                }}>
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
            <div style={{
              display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap",
              borderBottom: "1px solid #e7e5e4", paddingBottom: 20
            }}>
              {CATEGORIES.map(c => (
                <button key={c} className="cat-btn" onClick={() => setCategory(c)} style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "1.2px",
                  textTransform: "uppercase", padding: "8px 18px", borderRadius: 6,
                  color: category === c ? "#fff" : "#78716c",
                  background: category === c ? "#1a1a2e" : "#f5f5f4",
                  fontWeight: 500
                }}>
                  {c}
                </button>
              ))}
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(264px, 1fr))",
              gap: 24
            }}>
              {filtered.map((product, idx) => (
                <div key={product.id} className="product-card fade-up"
                  style={{
                    background: "#fff", borderRadius: 10, overflow: "hidden",
                    border: "1px solid #e7e5e4",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    animationDelay: `${idx * 0.07}s`
                  }}
                  onClick={() => setSelectedProduct(product)}
                >
                  <div style={{ position: "relative" }}>
                    {product.badge && <Badge text={product.badge}/>}
                    <MiniPlaceholder product={product}/>
                  </div>
                  <div style={{ padding: "16px 20px 20px" }}>
                    <div style={{
                      fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#c2410c",
                      letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 6, fontWeight: 500
                    }}>{product.category} · {product.detail} Detail</div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: "#1a1a2e" }}>{product.name}</h3>
                    <p style={{ fontSize: 13, color: "#a8a29e", lineHeight: 1.5, marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>
                      {product.desc.slice(0, 80)}…
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{
                        fontFamily: "'DM Mono', monospace", fontSize: 18, fontWeight: 500, color: "#1a1a2e"
                      }}>${product.price.toFixed(2)}</span>
                      <button className="add-btn" onClick={(e) => { e.stopPropagation(); addToCart(product); }} style={{
                        background: "#fff", border: "1.5px solid #1a1a2e", color: "#1a1a2e",
                        padding: "8px 18px", borderRadius: 6, fontSize: 11,
                        fontFamily: "'DM Mono', monospace", letterSpacing: "0.8px", textTransform: "uppercase",
                        fontWeight: 500
                      }}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <section style={{ marginTop: 80 }}>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "4px",
                color: "#c2410c", textTransform: "uppercase", marginBottom: 12, textAlign: "center", fontWeight: 500
              }}>Customer Reviews</div>
              <h2 style={{ fontSize: 38, textAlign: "center", marginBottom: 40, fontWeight: 700 }}>What Hobbyists Say</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                {REVIEWS.map((r, i) => (
                  <div key={i} style={{
                    padding: 28, background: "#fff", borderRadius: 10,
                    border: "1px solid #e7e5e4", boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
                  }}>
                    <div style={{ display: "flex", gap: 2, marginBottom: 14, color: "#c2410c" }}>
                      {Array.from({length: 5}).map((_, j) => <StarIcon key={j} filled={j < r.rating}/>)}
                    </div>
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
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "4px",
              color: "#c2410c", textTransform: "uppercase", marginBottom: 12, fontWeight: 500
            }}>Our Story</div>
            <h2 style={{ fontSize: 44, marginBottom: 24, fontWeight: 700 }}>Crafted with Obsession</h2>
            <div style={{ fontSize: 17, lineHeight: 1.9, color: "#78716c" }}>
              <p style={{ marginBottom: 20 }}>Forge & Resin was born from a simple frustration: miniatures that didn't live up to their digital sculpts. We use top-tier 8K mono LCD printers, premium resin blends, and a meticulous post-processing pipeline to deliver prints that look as good on your table as they do on screen.</p>
              <p style={{ marginBottom: 20 }}>Every miniature is hand-supported for optimal detail, UV-cured in a controlled environment, and individually inspected before shipping. We don't do mass production — we do precision craft.</p>
              <p>Based in Brisbane, we ship Australia-wide and internationally. Most orders dispatch within 48 hours.</p>
            </div>
          </div>
        )}

        {currentSection === "faq" && (
          <div className="fade-up" style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: "4px",
              color: "#c2410c", textTransform: "uppercase", marginBottom: 12, fontWeight: 500
            }}>FAQ</div>
            <h2 style={{ fontSize: 44, marginBottom: 32, fontWeight: 700 }}>Common Questions</h2>
            {[
              { q: "What resin do you use?", a: "We use a blend of ABS-like and water-washable resins depending on the model. All resins are UV-stable and low-odor." },
              { q: "Are miniatures pre-assembled?", a: "Smaller models ship fully assembled. Larger kits (75mm+) may ship in parts for safer transit and painting flexibility." },
              { q: "Do you do custom prints?", a: "Yes! Send us your STL files and we'll quote you. We support files from all major sculpting tools." },
              { q: "How do I paint resin minis?", a: "Our prints are primed-ready. We recommend a light coat of spray primer before painting with acrylics." },
              { q: "What's your return policy?", a: "If a print arrives damaged or defective, we'll replace it free of charge. Just send us a photo within 7 days." },
            ].map((item, i) => (
              <details key={i} style={{
                borderBottom: "1px solid #e7e5e4", padding: "20px 0",
              }}>
                <summary style={{
                  cursor: "pointer", fontSize: 18, fontWeight: 600, color: "#1a1a2e",
                  listStyle: "none", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  {item.q} <ChevronDown/>
                </summary>
                <p style={{ marginTop: 12, fontSize: 15, lineHeight: 1.7, color: "#78716c" }}>{item.a}</p>
              </details>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid #e7e5e4", padding: "40px 24px",
        textAlign: "center", background: "#fff"
      }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "#a8a29e", letterSpacing: "1px" }}>
          © 2026 FORGE & RESIN · Brisbane, Australia · All rights reserved
        </div>
      </footer>

      {/* CART DRAWER */}
      {cartOpen && (
        <>
          <div className="overlay" onClick={() => setCartOpen(false)} style={{ animation: "fadeIn 0.2s ease" }}/>
          <div style={{
            position: "fixed", right: 0, top: 0, bottom: 0, width: "min(400px, 90vw)",
            background: "#fff", zIndex: 101, borderLeft: "1px solid #e7e5e4",
            display: "flex", flexDirection: "column", animation: "slideIn 0.3s ease",
            boxShadow: "-8px 0 30px rgba(0,0,0,0.06)"
          }}>
            <div style={{
              padding: "20px 24px", borderBottom: "1px solid #e7e5e4",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
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
                <div key={item.id} style={{
                  display: "flex", gap: 14, padding: "16px 0",
                  borderBottom: "1px solid #f5f5f4"
                }}>
                  <div style={{ width: 64, height: 64, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
                    <MiniPlaceholder product={item}/>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, color: "#c2410c", fontWeight: 500 }}>
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                      <button onClick={() => updateQty(item.id, -1)} style={{
                        background: "#f5f5f4", border: "1px solid #e7e5e4", color: "#78716c",
                        width: 28, height: 28, borderRadius: 6, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}><MinusIcon/></button>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, minWidth: 20, textAlign: "center", fontWeight: 500 }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} style={{
                        background: "#f5f5f4", border: "1px solid #e7e5e4", color: "#78716c",
                        width: 28, height: 28, borderRadius: 6, cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center"
                      }}><PlusIcon/></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {cart.length > 0 && (
              <div style={{ padding: "20px 24px", borderTop: "1px solid #e7e5e4" }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", marginBottom: 16,
                  fontFamily: "'DM Mono', monospace"
                }}>
                  <span style={{ color: "#a8a29e", fontSize: 12, textTransform: "uppercase", letterSpacing: "1.5px" }}>Total</span>
                  <span style={{ fontSize: 22, fontWeight: 500, color: "#1a1a2e" }}>${cartTotal.toFixed(2)}</span>
                </div>
                <button style={{
                  width: "100%", padding: "14px", background: "#c2410c", color: "#fff",
                  border: "none", borderRadius: 8, fontFamily: "'DM Mono', monospace",
                  fontSize: 13, fontWeight: 500, letterSpacing: "1.5px", textTransform: "uppercase",
                  cursor: "pointer"
                }}>Checkout</button>
              </div>
            )}
          </div>
        </>
      )}

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <>
          <div className="overlay" onClick={() => setSelectedProduct(null)}/>
          <div style={{
            position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: "min(600px, 92vw)", maxHeight: "85vh", overflowY: "auto",
            background: "#fff", borderRadius: 12, zIndex: 101,
            border: "1px solid #e7e5e4", animation: "fadeUp 0.3s ease",
            boxShadow: "0 25px 60px rgba(0,0,0,0.1)"
          }}>
            <div style={{ position: "relative" }}>
              {selectedProduct.badge && <Badge text={selectedProduct.badge}/>}
              <MiniPlaceholder product={selectedProduct}/>
              <button onClick={() => setSelectedProduct(null)} style={{
                position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.85)",
                border: "none", color: "#78716c", cursor: "pointer", borderRadius: 6,
                width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(4px)"
              }}><XIcon/></button>
            </div>
            <div style={{ padding: "24px 28px 28px" }}>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#c2410c",
                letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 8, fontWeight: 500
              }}>{selectedProduct.category} · {selectedProduct.scale} · {selectedProduct.detail} Detail</div>
              <h2 style={{ fontSize: 30, marginBottom: 12, fontWeight: 700 }}>{selectedProduct.name}</h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "#78716c", marginBottom: 24 }}>{selectedProduct.desc}</p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 500 }}>
                  ${selectedProduct.price.toFixed(2)}
                </span>
                <button className="add-btn" onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} style={{
                  background: "#c2410c", border: "none", color: "#fff",
                  padding: "12px 30px", borderRadius: 8, fontSize: 12,
                  fontFamily: "'DM Mono', monospace", fontWeight: 500,
                  letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer"
                }}>Add to Cart</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TOAST */}
      {toast && (
        <div className="toast-anim" style={{
          position: "fixed", bottom: 24, left: "50%",
          background: "#1a1a2e", color: "#fff", padding: "12px 28px", borderRadius: 8,
          fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500,
          letterSpacing: "0.5px", zIndex: 200, boxShadow: "0 8px 30px rgba(0,0,0,0.15)"
        }}>{toast}</div>
      )}
    </div>
  );
}
