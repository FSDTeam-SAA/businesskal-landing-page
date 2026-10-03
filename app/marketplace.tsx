"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

type IconName =
  | "arrow"
  | "search"
  | "leaf"
  | "box"
  | "shirt"
  | "coffee"
  | "tools"
  | "globe"
  | "check"
  | "heart"
  | "star"
  | "menu"
  | "close"
  | "location"
  | "message"
  | "chart"
  | "bag";
function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M4 12h15M13 5l7 7-7 7" />,
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4 4" />
      </>
    ),
    leaf: (
      <>
        <path d="M20 4C9 2 3 8 5 15c2 7 15 5 15-11Z" />
        <path d="M4 21 15 10M9 16v-5M9 16h5" />
      </>
    ),
    box: <path d="m12 3 9 5-9 5-9-5 9-5ZM3 8v9l9 5 9-5V8M12 13v9M8 5l9 5" />,
    shirt: <path d="m8 3-6 4 3 5 3-2v11h8V10l3 2 3-5-6-4c0 4-8 4-8 0Z" />,
    coffee: (
      <path d="M4 8h13v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8ZM17 9h2a3 3 0 0 1 0 6h-2M7 2v3M11 2v3M15 2v3" />
    ),
    tools: (
      <path d="m14 6 4 4M5 19l8-8M3 21l3-1 14-14-2-2L4 18l-1 3ZM14 3a5 5 0 0 0 7 7" />
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18M5 7h14M5 17h14" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    heart: (
      <path d="M20.5 4.5a5.5 5.5 0 0 0-8.5 1 5.5 5.5 0 0 0-8.5-1c-5 5 1 10 8.5 15 7.5-5 13.5-10 8.5-15Z" />
    ),
    star: (
      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    location: (
      <>
        <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    message: <path d="M21 11a9 9 0 0 1-9 9H3l2-5a9 9 0 1 1 16-4Z" />,
    chart: <path d="M4 3v17h17M8 15l4-5 4 2 5-7M17 5h4v4" />,
    bag: <path d="M4 7h16l1 14H3L4 7ZM8 8V6a4 4 0 0 1 8 0v2" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
const categories: {
  name: string;
  icon: IconName;
  detail: string;
  color: string;
}[] = [
  {
    name: "Fresh produce",
    icon: "leaf",
    detail: "Farm to business",
    color: "green",
  },
  {
    name: "Food & beverages",
    icon: "coffee",
    detail: "Stock something good",
    color: "peach",
  },
  {
    name: "Fashion & textiles",
    icon: "shirt",
    detail: "Made for your market",
    color: "purple",
  },
  {
    name: "Packaging",
    icon: "box",
    detail: "A better first impression",
    color: "sand",
  },
  {
    name: "Business services",
    icon: "tools",
    detail: "Expertise that moves you",
    color: "blue",
  },
  {
    name: "All categories",
    icon: "globe",
    detail: "Your next opportunity",
    color: "pink",
  },
];
type Product = {
  id: number;
  name: string;
  category: string;
  image: string;
  supplier: string;
  location: string;
  price: string;
  unit: string;
  tag: string;
  description: string;
  type: "Products" | "Services";
};
const products: Product[] = [
  {
    id: 1,
    name: "Vine-ripened tomatoes",
    category: "Fresh produce",
    image: "tomatoes",
    supplier: "Greenfield Farms",
    location: "Bangladesh",
    price: "$2.40",
    unit: "/ kg",
    tag: "Farm fresh",
    description:
      "Fresh tomatoes for kitchens, retailers, and food businesses. Discuss quantities, seasonal availability, and delivery with your next supplier.",
    type: "Products",
  },
  {
    id: 2,
    name: "Fresh Hass avocados",
    category: "Fresh produce",
    image: "avocados",
    supplier: "Harvest Collective",
    location: "Kenya",
    price: "$3.80",
    unit: "/ kg",
    tag: "Popular pick",
    description:
      "Hass avocados for food service and retail. Explore ripeness, packaging, minimum quantities, and shipping options.",
    type: "Products",
  },
  {
    id: 3,
    name: "Specialty coffee beans",
    category: "Food & beverages",
    image: "coffee",
    supplier: "Origin Coffee Co.",
    location: "Vietnam",
    price: "$12.00",
    unit: "/ kg",
    tag: "Small batch",
    description:
      "Coffee beans for cafés, roasters, and hospitality businesses. Explore roast preferences, wholesale quantities, and sample options.",
    type: "Products",
  },
  {
    id: 4,
    name: "Everyday essentials footwear",
    category: "Fashion & textiles",
    image: "textiles",
    supplier: "Everyday Supply",
    location: "Bangladesh",
    price: "$24.00",
    unit: "/ pair",
    tag: "Retail ready",
    description:
      "Everyday footwear for your next retail collection. Discuss sizes, color options, wholesale quantities, and lead times.",
    type: "Products",
  },
  {
    id: 5,
    name: "Workspace design & planning",
    category: "Business services",
    image: "service",
    supplier: "Studio Collective",
    location: "Bangladesh",
    price: "On request",
    unit: "",
    tag: "For your business",
    description:
      "Thoughtful workspace planning for growing businesses. Share your space, timeline, and requirements for a tailored quotation.",
    type: "Services",
  },
  {
    id: 6,
    name: "Retail sourcing consultation",
    category: "Business services",
    image: "market",
    supplier: "Market Partners",
    location: "Bangladesh",
    price: "On request",
    unit: "",
    tag: "Expert support",
    description:
      "Find a sourcing approach that fits your business. Discuss product categories, purchasing needs, and supplier selection.",
    type: "Services",
  },
];
type Modal =
  | { type: "product"; product: Product }
  | { type: "seller" }
  | { type: "login" }
  | { type: "info"; title: string; text: string };
function Brand({ light = false }: { light?: boolean }) {
  return (
    <a
      className={`brand ${light ? "brand-light" : ""}`}
      href="#top"
      aria-label="Busineskal home"
    >
      <Image
        src="/images/mansa-logo.png"
        alt="MANSA"
        width={197}
        height={127}
        className="brand-image"
        preload={!light}
      />
    </a>
  );
}
function Dialog({ modal, close }: { modal: Modal; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  function saveInterest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      localStorage.setItem("busineskal-seller-interest", JSON.stringify(data));
      setSubmitted(true);
    } catch {
      setError(true);
    }
  }
  return (
    <dialog
      ref={ref}
      className="detail-dialog"
      onCancel={close}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      aria-labelledby="dialog-title"
    >
      <button
        className="icon-button dialog-close"
        aria-label="Close dialog"
        onClick={close}
      >
        <Icon name="close" />
      </button>
      {modal.type === "product" ? (
        <>
          <div className="dialog-image">
            <Image
              src={`/images/${modal.product.image}.jpg`}
              alt={modal.product.name}
              fill
              sizes="(max-width:600px) 90vw, 540px"
            />
          </div>
          <div className="dialog-body">
            <span className="eyebrow">
              SAMPLE {modal.product.type === "Products" ? "PRODUCT" : "SERVICE"}
            </span>
            <h2 id="dialog-title">{modal.product.name}</h2>
            <p>{modal.product.description}</p>
            <div className="dialog-product-meta">
              <span>
                <Icon name="location" size={16} />
                {modal.product.supplier} · {modal.product.location}
              </span>
              <strong>
                {modal.product.price}
                <small>{modal.product.unit}</small>
              </strong>
            </div>
            <p className="fine-print">
              This is a preview listing. Live supplier contact and ordering will
              be available when the marketplace launches.
            </p>
            <button className="button primary" onClick={close}>
              Keep exploring <Icon name="arrow" />
            </button>
          </div>
        </>
      ) : (
        <div className="dialog-body">
          <span className="dialog-mark">
            <Icon name={modal.type === "seller" ? "bag" : "globe"} size={30} />
          </span>
          <span className="eyebrow">LET’S MAKE GOOD BUSINESS</span>
          <h2 id="dialog-title">
            {modal.type === "seller"
              ? "Your next chapter starts here."
              : modal.type === "login"
                ? "Your marketplace is on its way."
                : modal.title}
          </h2>
          {modal.type === "seller" ? (
            submitted ? (
              <div className="interest-success" role="status">
                <Icon name="check" size={32} />
                <h3>You’re ready for your next step.</h3>
                <p>
                  Your interest has been saved on this device. Online
                  registration will open when the marketplace launches.
                </p>
                <button className="button primary" onClick={close}>
                  Back to exploring <Icon name="arrow" />
                </button>
              </div>
            ) : (
              <>
                <p>
                  Tell us a little about your business and get ready for your
                  next connection.
                </p>
                <form onSubmit={saveInterest} className="interest-form">
                  <label>
                    Your name
                    <input
                      name="name"
                      placeholder="Full name"
                      autoComplete="name"
                      required
                      maxLength={100}
                    />
                  </label>
                  <label>
                    Business email
                    <input
                      name="email"
                      type="email"
                      placeholder="you@business.com"
                      autoComplete="email"
                      required
                      maxLength={200}
                    />
                  </label>
                  <label>
                    Business name
                    <input
                      name="business"
                      placeholder="Your business"
                      autoComplete="organization"
                      required
                      maxLength={150}
                    />
                  </label>
                  <label>
                    What do you offer?
                    <select name="offering">
                      <option>Products</option>
                      <option>Services</option>
                      <option>Products & services</option>
                    </select>
                  </label>
                  <p className="fine-print">
                    Your details are saved only on this device. Nothing is
                    submitted online yet.
                  </p>
                  {error && (
                    <p role="alert">
                      Your browser could not save your details. Please enable
                      local storage and try again.
                    </p>
                  )}
                  <button className="button primary" type="submit">
                    Save my interest <Icon name="arrow" />
                  </button>
                </form>
              </>
            )
          ) : (
            <>
              <p>
                {modal.type === "login"
                  ? "Account sign-in will open with the full marketplace. In the meantime, discover products, explore services, and find your next opportunity."
                  : modal.text}
              </p>
              <button className="button primary" onClick={close}>
                Got it <Icon name="check" />
              </button>
            </>
          )}
        </div>
      )}
    </dialog>
  );
}
export default function Marketplace() {
  const [menuOpen, setMenuOpen] = useState(false),
    [tab, setTab] = useState<"Products" | "Services">("Products"),
    [query, setQuery] = useState(""),
    [search, setSearch] = useState(""),
    [category, setCategory] = useState("All categories"),
    [country, setCountry] = useState("Anywhere"),
    [saved, setSaved] = useState<number[]>([]),
    [modal, setModal] = useState<Modal | null>(null),
    [annual, setAnnual] = useState(false);
  const filtered = products.filter(
    (p) =>
      p.type === tab &&
      (category === "All categories" || p.category === category) &&
      (country === "Anywhere" || p.location === country) &&
      `${p.name} ${p.supplier} ${p.category}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const scrollCatalogue = () =>
    document
      .getElementById("marketplace")
      ?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  const openSeller = () => {
    setMenuOpen(false);
    setModal({ type: "seller" });
  };
  function browse(
    name = "All categories",
    targetTab: "Products" | "Services" = "Products",
  ) {
    setCategory(name);
    setTab(targetTab);
    setSearch("");
    setQuery("");
    setCountry("Anywhere");
    setMenuOpen(false);
    scrollCatalogue();
  }
  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearch(query.trim());
    setCategory("All categories");
    scrollCatalogue();
  }
  function searchSupplier(
    name: string,
    targetTab: "Products" | "Services" = "Products",
  ) {
    setTab(targetTab);
    setSearch(name);
    setQuery(name);
    setCategory("All categories");
    setCountry("Anywhere");
    scrollCatalogue();
  }
  return (
    <div id="top">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="announcement">
        <span>A world of opportunity. One place to connect.</span>
        <a href="#how-it-works">
          Meet your marketplace <Icon name="arrow" size={14} />
        </a>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            <a href="#marketplace" onClick={() => browse()}>
              Marketplace
            </a>
            <a href="#suppliers">Find suppliers</a>
            <a href="#how-it-works">How it works</a>
            <a href="#seller">For sellers</a>
          </nav>
          <div className="header-actions">
            <button
              className="login-button"
              onClick={() => setModal({ type: "login" })}
            >
              Log in
            </button>
            <button
              className="button primary header-seller"
              onClick={openSeller}
            >
              Start selling <Icon name="arrow" size={17} />
            </button>
            <button
              className="icon-button mobile-toggle"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? "close" : "menu"} size={24} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            <a href="#marketplace" onClick={() => browse()}>
              Marketplace <Icon name="arrow" />
            </a>
            <a href="#suppliers" onClick={() => setMenuOpen(false)}>
              Find suppliers <Icon name="arrow" />
            </a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              How it works <Icon name="arrow" />
            </a>
            <a href="#seller" onClick={() => setMenuOpen(false)}>
              For sellers <Icon name="arrow" />
            </a>
            <button className="button primary" onClick={openSeller}>
              Start selling <Icon name="arrow" />
            </button>
          </nav>
        )}
      </header>
      <main id="main">
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">
                <span className="live-dot" />
                BIG OPPORTUNITIES. REAL CONNECTIONS.
              </span>
              <h1>
                Good business
                <br />
                starts with a<br />
                <span className="serif-accent">connection.</span>
                <svg
                  className="headline-spark"
                  viewBox="0 0 40 42"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="m7 29 24-7M10 16 17 5M27 35l9 3"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </h1>
              <p>
                Find the right products. Meet the right people.
                <br className="desktop-break" />
                Build something bigger, together.
              </p>
              <form className="hero-search" onSubmit={submitSearch}>
                <label className="search-input">
                  <Icon name="search" />
                  <input
                    aria-label="Search products or services"
                    placeholder="What is your business looking for?"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
                <button
                  className="search-submit"
                  aria-label="Search marketplace"
                  type="submit"
                >
                  <Icon name="arrow" size={23} />
                </button>
              </form>
              <div className="popular-searches">
                <span>Popular:</span>
                {["Fresh produce", "Coffee", "Packaging"].map((x) => (
                  <button
                    key={x}
                    onClick={() =>
                      x === "Coffee" ? searchSupplier("coffee") : browse(x)
                    }
                  >
                    {x}
                  </button>
                ))}
              </div>
              <div className="hero-proof">
                <span className="proof-icon">
                  <Icon name="check" size={17} />
                </span>
                <span>
                  Made for buyers. Built for suppliers.
                  <strong>Better for business.</strong>
                </span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hero-image">
                <Image
                  src="/images/market.jpg"
                  alt="Colorful fresh produce at a local market"
                  fill
                  sizes="(max-width:760px) 100vw, 50vw"
                  preload
                />
                <div className="image-caption">
                  <span>LOCAL ROOTS.</span>
                  <span>GLOBAL POSSIBILITIES.</span>
                </div>
              </div>
              <div className="hero-stamp">
                <Icon name="globe" size={27} />
                <span>
                  A whole world
                  <br />
                  of possibility
                </span>
                <Icon name="star" size={12} />
              </div>
              <div className="connection-card">
                <span className="connection-icon">
                  <Icon name="leaf" size={27} />
                </span>
                <div>
                  <span>Your next business partner</span>
                  <strong>Closer than you think.</strong>
                  <small>
                    <span className="live-dot" />A fresh way to do business
                  </small>
                </div>
                <span className="connection-arrow">
                  <Icon name="arrow" size={19} />
                </span>
              </div>
              <span className="visual-dots" aria-hidden="true" />
            </div>
          </div>
        </section>
        <section
          className="business-strip"
          aria-label="Who the marketplace is for"
        >
          <div className="container">
            <span className="strip-label">
              A PLACE FOR EVERY
              <br />
              <strong>KIND OF BUSINESS</strong>
            </span>
            <div className="business-types">
              {(
                [
                  { name: "Growers", icon: "leaf" },
                  { name: "Retailers", icon: "bag" },
                  { name: "Wholesalers", icon: "box" },
                  { name: "Hospitality", icon: "coffee" },
                  { name: "Service providers", icon: "tools" },
                ] as { name: string; icon: IconName }[]
              ).map((x) => (
                <span key={x.name}>
                  <Icon name={x.icon} />
                  {x.name}
                </span>
              ))}
            </div>
          </div>
        </section>
        <section className="section categories-section" id="categories">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">FIND YOUR NEXT BIG THING</span>
                <h2>
                  A little of everything.
                  <br />A lot of{" "}
                  <span className="serif-accent">opportunity.</span>
                </h2>
              </div>
              <a
                href="#marketplace"
                className="text-link"
                onClick={() => browse()}
              >
                Explore the marketplace <Icon name="arrow" />
              </a>
            </div>
            <div className="category-grid">
              {categories.map((c) => (
                <button
                  key={c.name}
                  className={`category-card ${c.color}`}
                  onClick={() =>
                    browse(
                      c.name,
                      c.name === "Business services" ? "Services" : "Products",
                    )
                  }
                >
                  <span className="category-icon">
                    <Icon name={c.icon} size={29} />
                  </span>
                  <strong>{c.name}</strong>
                  <span>{c.detail}</span>
                  <Icon name="arrow" size={18} className="category-arrow" />
                </button>
              ))}
            </div>
          </div>
        </section>
        <section className="section marketplace-section" id="marketplace">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">DISCOVER THE MARKETPLACE</span>
                <h2>
                  Fresh finds for your{" "}
                  <span className="serif-accent">business.</span>
                </h2>
                <p>
                  Meet your next bestseller. Explore a preview of what’s in
                  store.
                </p>
              </div>
              <div
                className="catalogue-tabs"
                role="tablist"
                aria-label="Listing type"
              >
                {(["Products", "Services"] as const).map((t) => (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={tab === t}
                    aria-controls="catalogue-panel"
                    id={`tab-${t.toLowerCase()}`}
                    tabIndex={tab === t ? 0 : -1}
                    className={tab === t ? "active" : ""}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                        e.preventDefault();
                        const next = t === "Products" ? "Services" : "Products";
                        setTab(next);
                        setCategory("All categories");
                        document
                          .getElementById(`tab-${next.toLowerCase()}`)
                          ?.focus();
                      }
                    }}
                    onClick={() => {
                      setTab(t);
                      setCategory("All categories");
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="catalogue-filters">
              <div className="filter-pills">
                {[
                  ...new Set([
                    "All categories",
                    ...(category !== "All categories" ? [category] : []),
                    ...products
                      .filter((p) => p.type === tab)
                      .map((p) => p.category),
                  ]),
                ].map((c) => (
                  <button
                    key={c}
                    className={category === c ? "active" : ""}
                    aria-pressed={category === c}
                    onClick={() => setCategory(c)}
                  >
                    {c === "All categories" ? "All " + tab.toLowerCase() : c}
                  </button>
                ))}
              </div>
              <label className="country-filter">
                <Icon name="location" size={16} />
                <select
                  aria-label="Filter by supplier country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="Anywhere">Anywhere</option>
                  <option>Bangladesh</option>
                  <option>Kenya</option>
                  <option>Vietnam</option>
                </select>
              </label>
            </div>
            {search && (
              <div className="search-summary" role="status">
                Results for “{search}”
                <button
                  onClick={() => {
                    setSearch("");
                    setQuery("");
                  }}
                  aria-label="Clear search"
                >
                  <Icon name="close" size={16} />
                </button>
              </div>
            )}
            <div
              id="catalogue-panel"
              role="tabpanel"
              aria-labelledby={`tab-${tab.toLowerCase()}`}
            >
              <div className="product-grid">
                {filtered.map((p) => (
                  <article className="product-card" key={p.id}>
                    <div className="product-image">
                      <button
                        className="product-image-link"
                        aria-label={`View ${p.name}`}
                        onClick={() =>
                          setModal({ type: "product", product: p })
                        }
                      >
                        <Image
                          src={`/images/${p.image}.jpg`}
                          alt={p.name}
                          fill
                          sizes="(max-width:540px) 45vw, (max-width:1000px) 45vw, 25vw"
                        />
                      </button>
                      <span className="product-tag">{p.tag}</span>
                      <button
                        className={`favorite-button ${saved.includes(p.id) ? "saved" : ""}`}
                        aria-label={`${saved.includes(p.id) ? "Unsave" : "Save"} ${p.name}`}
                        aria-pressed={saved.includes(p.id)}
                        onClick={() =>
                          setSaved(
                            saved.includes(p.id)
                              ? saved.filter((id) => id !== p.id)
                              : [...saved, p.id],
                          )
                        }
                      >
                        <Icon name="heart" size={19} />
                      </button>
                    </div>
                    <div className="product-body">
                      <span className="product-category">{p.category}</span>
                      <h3>
                        <button
                          onClick={() =>
                            setModal({ type: "product", product: p })
                          }
                        >
                          {p.name}
                        </button>
                      </h3>
                      <p className="supplier-line">
                        <span className="supplier-dot" />
                        {p.supplier}
                      </p>
                      <div className="product-bottom">
                        <strong>
                          {p.price}
                          <small>{p.unit}</small>
                        </strong>
                        <span>
                          <Icon name="location" size={13} />
                          {p.location}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              {!filtered.length && (
                <div className="empty-state">
                  <Icon name="search" size={32} />
                  <h3>A new opportunity is waiting.</h3>
                  <p>
                    No preview listings match these filters. Try another search
                    or explore all listings.
                  </p>
                  <button
                    className="button secondary"
                    onClick={() => {
                      setSearch("");
                      setQuery("");
                      setCategory("All categories");
                      setCountry("Anywhere");
                    }}
                  >
                    Clear filters <Icon name="arrow" />
                  </button>
                </div>
              )}
            </div>
            <div className="catalogue-note">
              <span>
                <Icon name="globe" size={17} />
                Big ideas start with a little exploring.
              </span>
              <button
                className="text-link"
                onClick={() =>
                  browse(
                    "All categories",
                    tab === "Products" ? "Services" : "Products",
                  )
                }
              >
                Explore {tab === "Products" ? "services" : "products"}{" "}
                <Icon name="arrow" />
              </button>
            </div>
          </div>
        </section>
        <section className="section steps-section" id="how-it-works">
          <div className="container">
            <div className="section-heading centered">
              <span className="eyebrow">
                LESS FRICTION. MORE POSSIBILITIES.
              </span>
              <h2>
                From hello to{" "}
                <span className="serif-accent">let’s do business.</span>
              </h2>
              <p>Good connections shouldn’t be complicated.</p>
            </div>
            <div className="steps-grid">
              {(
                [
                  {
                    number: "01",
                    icon: "search",
                    title: "Find your fit",
                    text: "Explore products, services, and suppliers that understand what your business needs.",
                  },
                  {
                    number: "02",
                    icon: "message",
                    title: "Start a conversation",
                    text: "Ask a question, request a quotation, and get to know the people behind the products.",
                  },
                  {
                    number: "03",
                    icon: "chart",
                    title: "Grow, together",
                    text: "Compare your options, choose the right partner, and build a connection that lasts.",
                  },
                ] as {
                  number: string;
                  icon: IconName;
                  title: string;
                  text: string;
                }[]
              ).map((s) => (
                <div className="step-card" key={s.number}>
                  <div className="step-top">
                    <span className="step-icon">
                      <Icon name={s.icon} size={29} />
                    </span>
                    <span className="step-number">{s.number}</span>
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="section supplier-section" id="suppliers">
          <div className="container supplier-layout">
            <div className="supplier-copy">
              <span className="eyebrow">REAL PEOPLE. SHARED AMBITION.</span>
              <h2>
                Your next partner.
                <br />
                Your next <span className="serif-accent">possibility.</span>
              </h2>
              <p>
                Behind every great product is a business worth knowing. Discover
                the growers, makers, and experts ready for their next
                connection.
              </p>
              <a
                href="#marketplace"
                className="button secondary"
                onClick={() => browse()}
              >
                Discover suppliers <Icon name="arrow" />
              </a>
              <div className="supplier-principles">
                <span>
                  <Icon name="check" size={16} />
                  Direct conversations
                </span>
                <span>
                  <Icon name="check" size={16} />
                  Local & global discovery
                </span>
              </div>
            </div>
            <div className="supplier-preview">
              <span className="preview-label">
                A FEW FACES OF THE MARKETPLACE
              </span>
              {(
                [
                  {
                    name: "Greenfield Farms",
                    description: "Fresh produce · Bangladesh",
                    icon: "leaf",
                    color: "green",
                  },
                  {
                    name: "Origin Coffee Co.",
                    description: "Food & beverages · Vietnam",
                    icon: "coffee",
                    color: "peach",
                  },
                  {
                    name: "Studio Collective",
                    description: "Business services · Bangladesh",
                    icon: "tools",
                    color: "purple",
                  },
                ] as {
                  name: string;
                  description: string;
                  icon: IconName;
                  color: string;
                }[]
              ).map((s) => (
                <button
                  className="supplier-preview-card"
                  key={s.name}
                  onClick={() =>
                    searchSupplier(
                      s.name,
                      s.icon === "tools" ? "Services" : "Products",
                    )
                  }
                >
                  <span className={`supplier-avatar ${s.color}`}>
                    <Icon name={s.icon} size={27} />
                  </span>
                  <span>
                    <strong>{s.name}</strong>
                    <small>{s.description}</small>
                  </span>
                  <Icon name="arrow" size={20} />
                </button>
              ))}
              <span className="supplier-preview-foot">
                <span className="live-dot" />
                Sample profiles. A world of potential.
              </span>
            </div>
          </div>
        </section>
        <section className="seller-section" id="seller">
          <div className="container seller-grid">
            <div className="seller-copy">
              <span className="eyebrow">
                YOU MAKE IT. LET’S HELP YOU GROW IT.
              </span>
              <h2>
                Your business.
                <br />A bigger <span className="serif-accent">world.</span>
              </h2>
              <p>
                Give your products a place to shine. Connect with new buyers and
                bring your shop, orders, and conversations together.
              </p>
              <ul>
                {[
                  "Showcase your products and services",
                  "Keep track of inventory, orders, and sales",
                  "Build relationships beyond your local market",
                ].map((x) => (
                  <li key={x}>
                    <span>
                      <Icon name="check" size={15} />
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
              <button className="button dark" onClick={openSeller}>
                Become a seller <Icon name="arrow" />
              </button>
              <span className="seller-small">
                Small beginnings. Bigger possibilities.
              </span>
            </div>
            <div className="dashboard-wrap">
              <div
                className="dashboard-preview"
                aria-label="Illustration of the planned seller dashboard"
              >
                <div className="dashboard-topbar">
                  <span className="mini-brand">b.</span>
                  <span>My business</span>
                  <span className="dashboard-profile">GF</span>
                </div>
                <div className="dashboard-content">
                  <div className="dashboard-sidebar">
                    <Icon name="chart" size={19} />
                    <Icon name="bag" size={19} />
                    <Icon name="box" size={19} />
                    <Icon name="message" size={19} />
                  </div>
                  <div className="dashboard-main">
                    <div className="dashboard-greeting">
                      <div>
                        <small>YOUR BUSINESS, AT A GLANCE</small>
                        <strong>Good things are growing.</strong>
                      </div>
                      <span className="dashboard-period">This month ⌄</span>
                    </div>
                    <div className="dashboard-stats">
                      <div>
                        <span>Total sales</span>
                        <strong>
                          $8,240<span>↗ 12.8%</span>
                        </strong>
                        <small>Illustrative data</small>
                      </div>
                      <div>
                        <span>Active products</span>
                        <strong>
                          24<span>↗ 4 new</span>
                        </strong>
                        <small>Illustrative data</small>
                      </div>
                    </div>
                    <div className="dashboard-chart">
                      <div>
                        <strong>Sales overview</strong>
                        <span>
                          <i />
                          Sales
                        </span>
                      </div>
                      <svg viewBox="0 0 400 125" fill="none" aria-hidden="true">
                        <defs>
                          <linearGradient
                            id="chart-fill"
                            x1="0"
                            x2="0"
                            y1="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#eda824"
                              stopOpacity=".25"
                            />
                            <stop
                              offset="100%"
                              stopColor="#eda824"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0 25h400M0 65h400M0 105h400"
                          stroke="#f1efe9"
                          strokeDasharray="4 5"
                        />
                        <path
                          d="M0 105C30 105 28 66 64 78S107 106 136 61s38 11 69-5 39-46 69-29 52 10 65-8 32 17 61-16V125H0Z"
                          fill="url(#chart-fill)"
                        />
                        <path
                          d="M0 105C30 105 28 66 64 78S107 106 136 61s38 11 69-5 39-46 69-29 52 10 65-8 32 17 61-16"
                          stroke="#e69c1c"
                          strokeWidth="3"
                        />
                      </svg>
                      <div className="chart-months">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
                          <span key={m}>{m}</span>
                        ))}
                      </div>
                    </div>
                    <div className="dashboard-orders">
                      <strong>Recent orders</strong>
                      <span>View all →</span>
                    </div>
                    <div className="dashboard-order">
                      <span className="order-icon">
                        <Icon name="leaf" size={19} />
                      </span>
                      <div>
                        <strong>Fresh produce box</strong>
                        <small>Order #BK-1024</small>
                      </div>
                      <span className="order-status">Completed</span>
                      <strong>$240.00</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div className="growth-card">
                <span>
                  <Icon name="chart" size={22} />
                </span>
                <div>
                  <strong>Room to grow.</strong>
                  <small>Tools to take your next step.</small>
                </div>
                <Icon name="arrow" size={18} />
              </div>
              <span className="dashboard-caption">
                A preview of your future seller workspace
              </span>
            </div>
          </div>
        </section>
        <section className="section plans-section" id="plans">
          <div className="container">
            <div className="section-heading centered">
              <span className="eyebrow">BUILT FOR YOUR NEXT CHAPTER</span>
              <h2>
                Start small. <span className="serif-accent">Think bigger.</span>
              </h2>
              <p>A home for your business, at every stage of the journey.</p>
            </div>
            <div className="billing-toggle" aria-label="Plan billing period">
              <button
                className={!annual ? "active" : ""}
                aria-pressed={!annual}
                onClick={() => setAnnual(false)}
              >
                Monthly
              </button>
              <button
                className={annual ? "active" : ""}
                aria-pressed={annual}
                onClick={() => setAnnual(true)}
              >
                Yearly
              </button>
            </div>
            <div className="plans-grid">
              {[
                {
                  name: "Basic",
                  caption: "A place to get started.",
                  headline: "Plant the seed.",
                  features: [
                    "Your own business profile",
                    "Product & service listings",
                    "Buyer conversations",
                    "Essential seller tools",
                  ],
                  premium: false,
                },
                {
                  name: "Premium",
                  caption: "Make room for what’s next.",
                  headline: "Grow your reach.",
                  features: [
                    "Everything in Basic",
                    "More room for your catalogue",
                    "Advanced sales insights",
                    "Additional shop customization",
                  ],
                  premium: true,
                },
              ].map((plan) => (
                <article
                  className={`plan-card ${plan.premium ? "premium" : ""}`}
                  key={plan.name}
                >
                  {plan.premium && (
                    <span className="plan-badge">FOR YOUR NEXT BIG STEP</span>
                  )}
                  <div className="plan-heading">
                    <span>{plan.name}</span>
                    <Icon name={plan.premium ? "chart" : "leaf"} size={29} />
                  </div>
                  <p>{plan.caption}</p>
                  <h3>{plan.headline}</h3>
                  <span className="plan-pricing">
                    {annual ? "Yearly" : "Monthly"} pricing announced at launch
                  </span>
                  <ul>
                    {plan.features.map((f) => (
                      <li key={f}>
                        <Icon name="check" size={17} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`button ${plan.premium ? "dark" : "secondary"}`}
                    onClick={openSeller}
                  >
                    Register your interest <Icon name="arrow" />
                  </button>
                </article>
              ))}
            </div>
            <p className="plans-note">
              A preview of our planned memberships. Final features and pricing
              will be confirmed at launch.
            </p>
          </div>
        </section>
        <section className="section faq-section">
          <div className="container faq-layout">
            <div>
              <span className="eyebrow">A LITTLE MORE TO KNOW</span>
              <h2>
                Good questions.
                <br />
                <span className="serif-accent">Clear answers.</span>
              </h2>
              <p>A few things before your next connection.</p>
            </div>
            <div className="faq-list">
              {[
                {
                  q: "What is Busineskal?",
                  a: "Busineskal is a marketplace designed to connect buyers with product suppliers and service providers. Explore offerings, find businesses, and build connections in one place.",
                },
                {
                  q: "Can I sell both products and services?",
                  a: "Yes. The planned seller experience supports product and service listings, shop profiles, inventory management, messaging, orders, and sales insights.",
                },
                {
                  q: "How do I find the right supplier?",
                  a: "Browse by category, search for a product or service, and filter by supplier location. Once the marketplace launches, you will be able to contact suppliers and discuss your requirements directly.",
                },
                {
                  q: "Is the marketplace live yet?",
                  a: "This landing page previews the marketplace experience. Listings and dashboard figures are examples. Live accounts, supplier messaging, payments, and ordering will open with the full launch.",
                },
              ].map((f) => (
                <details key={f.q}>
                  <summary>
                    {f.q}
                    <span>+</span>
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
        <section className="final-cta">
          <div className="container">
            <span className="eyebrow">YOUR NEXT OPPORTUNITY IS OUT THERE.</span>
            <h2>
              Let’s find it <span className="serif-accent">together.</span>
              <span aria-hidden="true">✳</span>
            </h2>
            <p>A new product. A new partner. A whole new possibility.</p>
            <div>
              <a
                className="button dark"
                href="#marketplace"
                onClick={() => browse()}
              >
                Explore the marketplace <Icon name="arrow" />
              </a>
              <button className="button cta-secondary" onClick={openSeller}>
                Become a seller <Icon name="arrow" />
              </button>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="container">
          <div className="footer-main">
            <div className="footer-brand">
              <Brand light />
              <p>
                Local roots. Global possibilities.
                <br />
                Good business, together.
              </p>
              <span className="footer-location">
                <Icon name="globe" size={16} />
                Built for a connected world.
              </span>
            </div>
            <div className="footer-column">
              <strong>Explore</strong>
              <a href="#marketplace" onClick={() => browse()}>
                Products
              </a>
              <a
                href="#marketplace"
                onClick={() => browse("All categories", "Services")}
              >
                Services
              </a>
              <a href="#suppliers">Suppliers</a>
              <a href="#categories">Categories</a>
            </div>
            <div className="footer-column">
              <strong>For your business</strong>
              <a href="#how-it-works">How it works</a>
              <button onClick={openSeller}>Become a seller</button>
              <a href="#plans">Membership plans</a>
              <button onClick={() => setModal({ type: "login" })}>
                My account
              </button>
            </div>
            <div className="footer-column">
              <strong>Let’s stay connected</strong>
              <p>
                The next chapter of business
                <br />
                is coming. Be part of it.
              </p>
              <button className="footer-interest" onClick={openSeller}>
                Register your interest <Icon name="arrow" size={17} />
              </button>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Busineskal. All rights reserved.</span>
            <div>
              <button
                onClick={() =>
                  setModal({
                    type: "info",
                    title: "Your privacy matters.",
                    text: "This preview saves seller interest only in your browser when you submit the form. It does not send your details to a server. A full privacy policy will be provided before marketplace registration opens.",
                  })
                }
              >
                Privacy
              </button>
              <button
                onClick={() =>
                  setModal({
                    type: "info",
                    title: "About this preview.",
                    text: "The catalogue, prices, supplier profiles, and dashboard data are illustrative. This preview does not process transactions or create online accounts. Marketplace terms will be available at launch.",
                  })
                }
              >
                Terms
              </button>
              <span>
                Made for possibility <Icon name="star" size={13} />
              </span>
            </div>
          </div>
        </div>
      </footer>
      {modal && <Dialog modal={modal} close={() => setModal(null)} />}
    </div>
  );
}
