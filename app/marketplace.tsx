"use client";

import Image from "next/image";
import AccountDialog, { type AccountMode } from "./account-dialog";
import type { Account } from "./lib/account";
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
type Product = {
  id: string;
  supplierId: string;
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
type Supplier = {
  id: string;
  name: string;
  location: string;
  types: ("Products" | "Services")[];
};
function ListingImage({ image, name, sizes }: { image: string; name: string; sizes: string }) {
  const [failed, setFailed] = useState(false);
  return <Image src={!failed && image ? image : "/images/listing-placeholder.svg"}
    alt={name} fill sizes={sizes} unoptimized onError={() => setFailed(true)} />;
}
type Modal =
  | { type: "product"; product: Product }
  | { type: "auth"; mode: AccountMode }
  | { type: "info"; title: string; text: string };
function Brand({ light = false }: { light?: boolean }) {
  return (
    <a
      className={`brand ${light ? "brand-light" : ""}`}
      href="#top"
      aria-label="Busineskal home"
    >
      <span className="brand-symbol" aria-hidden="true">b.</span>
      <span className="brand-name">Busineskal</span>
    </a>
  );
}
function Dialog({ modal, close }: { modal: Exclude<Modal, { type: "auth" }>; close: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  return <dialog ref={ref} className="detail-dialog" onCancel={close}
    onClick={(event) => { if (event.target === event.currentTarget) close(); }} aria-labelledby="dialog-title">
    <button className="icon-button dialog-close" aria-label="Close dialog" onClick={close}><Icon name="close" /></button>
    {modal.type === "product" ? <>
      <div className="dialog-image"><ListingImage image={modal.product.image} name={modal.product.name} sizes="(max-width:600px) 90vw, 540px" /></div>
      <div className="dialog-body"><span className="eyebrow">{modal.product.type === "Products" ? "PRODUCT" : "SERVICE"}</span>
        <h2 id="dialog-title">{modal.product.name}</h2><p>{modal.product.description}</p>
        <div className="dialog-product-meta"><span><Icon name="location" size={16} />{modal.product.supplier} / {modal.product.location}</span><strong>{modal.product.price}<small>{modal.product.unit}</small></strong></div>
        <p className="fine-print">Published by {modal.product.supplier}. This website provides marketplace discovery and account registration.</p>
        <button className="button primary" onClick={close}>Keep exploring <Icon name="arrow" /></button>
      </div>
    </> : <div className="dialog-body"><h2 id="dialog-title">{modal.title}</h2><p>{modal.text}</p><button className="button primary" onClick={close}>Got it <Icon name="check" /></button></div>}
  </dialog>;
}
export default function Marketplace() {
  const [menuOpen, setMenuOpen] = useState(false),
    [tab, setTab] = useState<"Products" | "Services">("Products"),
    [query, setQuery] = useState(""),
    [search, setSearch] = useState(""),
    [category, setCategory] = useState("All categories"),
    [country, setCountry] = useState("Anywhere"),
    [modal, setModal] = useState<Modal | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/account/session", { signal: controller.signal, cache: "no-store" })
      .then((response) => response.json()).then((result) => { if (result.success && !controller.signal.aborted) setAccount(result.data); })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  function openAccount(mode: AccountMode) {
    setMenuOpen(false);
    setModal({ type: "auth", mode: account && mode === "login" ? "account" : mode });
  }
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierFilter, setSupplierFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [catalogueError, setCatalogueError] = useState("");
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/marketplace", { signal: controller.signal, cache: "no-store" });
        const result = await response.json();
        if (!response.ok || result.success !== true) throw new Error(result.message || "Could not load marketplace.");
        if (!controller.signal.aborted) {
          setProducts(result.data.listings);
          setSuppliers(result.data.suppliers);
          setTab((current) => result.data.listings.some((p: Product) => p.type === current)
            ? current : result.data.listings[0]?.type || current);
        }
      } catch (cause) {
        if (!controller.signal.aborted) setCatalogueError(cause instanceof Error ? cause.message : "Could not load marketplace.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [reload]);
  function retryCatalogue() {
    setLoading(true);
    setCatalogueError("");
    setReload((value) => value + 1);
  }
  const categories = [...new Set(products.map((p) => p.category))].map((name) => ({
    name, icon: "box" as IconName, detail: "Explore listings", color: "green",
    type: products.find((p) => p.category === name)?.type || "Products",
  }));
  const filtered = products.filter(
    (p) =>
      p.type === tab &&
      (!supplierFilter || p.supplierId === supplierFilter) &&
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
    openAccount(account ? account.role === "user" ? "become-seller" : "account" : "seller-signup");
  };
  function browse(
    name = "All categories",
    targetTab: "Products" | "Services" = products.some((p) => p.type === "Products") ? "Products" : "Services",
  ) {
    setCategory(name);
    setSupplierFilter("");
    setTab(targetTab);
    setSearch("");
    setQuery("");
    setCountry("Anywhere");
    setMenuOpen(false);
    scrollCatalogue();
  }
  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSupplierFilter("");
    setSearch(query.trim());
    setCategory("All categories");
    scrollCatalogue();
  }
  function searchSupplier(
    name: string,
    targetTab: "Products" | "Services" = "Products",
    supplierId = "",
  ) {
    setSupplierFilter(supplierId);
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
              onClick={() => openAccount("login")}
            >
              {account ? "My account" : "Sign in"}
            </button>
            <button
              className="button primary header-seller"
              onClick={() => account ? account.role === "user" ? openSeller() : browse() : openAccount("signup")}
            >
              {account ? account.role === "user" ? "Become a seller" : "Explore marketplace" : "Create account"} <Icon name="arrow" size={17} />
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
              {categories.length > 0 && <div className="popular-searches">
                <span>Popular:</span>
                {categories.slice(0, 3).map((c) => (
                  <button
                    key={c.name}
                    onClick={() => browse(c.name, c.type)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>}
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
            {!categories.length && <p role="status">{loading ? "Loading categories?" : catalogueError ? "Categories will appear when the marketplace is available." : "Categories will appear as listings are published."}</p>}
            <div className="category-grid">
              {categories.map((c) => (
                <button
                  key={c.name}
                  className={`category-card ${c.color}`}
                  onClick={() =>
                    browse(
                      c.name,
                      c.type,
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
                  Meet your next bestseller. Explore the latest published
                  products and services from our marketplace.
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
                  {[...new Set(products.map((p) => p.location).filter(Boolean))].sort().map((location) => <option key={location}>{location}</option>)}
                </select>
              </label>
            </div>
            {search && (
              <div className="search-summary" role="status">
                Results for “{search}”
                <button
                  onClick={() => {
                    setSupplierFilter("");
                    setSearch("");
                    setQuery("");
                  }}
                  aria-label="Clear search"
                >
                  <Icon name="close" size={16} />
                </button>
              </div>
            )}
            {loading && <div className="empty-state" role="status">Loading marketplace listings...</div>}
            {catalogueError && <div className="empty-state" role="alert">
              <h3>Marketplace unavailable</h3><p>{catalogueError}</p>
              <button className="button secondary" onClick={retryCatalogue}>Try again <Icon name="arrow" /></button>
            </div>}
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
                        <ListingImage image={p.image} name={p.name}
                          sizes="(max-width:540px) 45vw, (max-width:1000px) 45vw, 25vw"
                        />
                      </button>
                      <span className="product-tag">{p.tag}</span>

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
              {!loading && !catalogueError && !filtered.length && (
                <div className="empty-state">
                  <Icon name="search" size={32} />
                  <h3>A new opportunity is waiting.</h3>
                  <p>
                    No published listings match these filters. Try another search
                    or explore all listings.
                  </p>
                  <button
                    className="button secondary"
                    onClick={() => {
                      setSupplierFilter("");
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
                    title: "Create your account",
                    text: "Register as a buyer to join Busineskal, or submit your business details to apply as a seller.",
                  },
                  {
                    number: "03",
                    icon: "chart",
                    title: "Take your next step",
                    text: "Sign in to your account. Seller accounts become available after our team approves your application.",
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
                  Approved seller accounts
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
              {suppliers.map((s) => (
                <button className="supplier-preview-card" key={s.id}
                  onClick={() => searchSupplier(s.name, s.types[0], s.id)}>
                  <span className="supplier-avatar green"><Icon name="bag" size={27} /></span>
                  <span><strong>{s.name}</strong><small>{s.types.join(" & ")}{s.location ? " · " + s.location : ""}</small></span>
                  <Icon name="arrow" size={20} />
                </button>
              ))}
              {!suppliers.length && <p role="status">{loading ? "Loading suppliers..." : catalogueError ? "Suppliers are temporarily unavailable." : "No suppliers have published listings yet."}</p>}
              <span className="supplier-preview-foot">
                <span className="live-dot" />
                {suppliers.length} suppliers with published listings
              </span>
            </div>
          </div>
        </section>
        <section className="seller-section" id="seller">
          <div className="container seller-grid">
            <div className="seller-copy"><span className="eyebrow">BUILD YOUR BUSINESS WITH BUSINESKAL</span>
              <h2>Your business.<br />A bigger <span className="serif-accent">world.</span></h2>
              <p>Apply to join our marketplace as a product supplier or service provider. Already have a buyer account? Sign in and submit your business details.</p>
              <ul>{["One account for your business", "Products and services in one marketplace", "Seller applications reviewed by our team"].map((item) => <li key={item}><span><Icon name="check" size={15} /></span>{item}</li>)}</ul>
              <button className="button dark" onClick={openSeller}>{account?.role === "seller" ? "View seller account" : "Become a seller"} <Icon name="arrow" /></button>
              <span className="seller-small">Seller approval is required before seller sign-in.</span>
            </div>
            <div className="seller-process"><span className="eyebrow">YOUR PATH TO SELLING</span>
              {[{ step: "01", title: "Tell us about your business", text: "Provide your business name, country, phone number, and what you offer." },
                { step: "02", title: "Submit your application", text: "Create a seller account, or apply from your existing buyer account." },
                { step: "03", title: "Get approved", text: "An administrator reviews your application. Once approved, sign in with your email and password." }].map((item) => <div className="seller-process-step" key={item.step}><span>{item.step}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></div>)}
            </div>
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
                  a: "Yes. Busineskal supports product suppliers and service providers. Apply as a seller with your business details; admin approval is required before seller sign-in.",
                },
                {
                  q: "How do I find the right supplier?",
                  a: "Browse by category, search for a product or service, and filter by supplier location. You can inspect published listing details here. Direct supplier messaging will be available with the full marketplace.",
                },
                {
                  q: "What can I do on this website?",
                  a: "This website displays published products and services, supports buyer and seller registration, and lets approved accounts sign in. Ordering, messaging, and seller management are part of the marketplace application.",
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
      <footer className="site-footer"><div className="container footer-main">
        <div className="footer-brand"><Brand light /><p>Discover products and services. Meet suppliers. Build your next business connection.</p></div>
        <div className="footer-column"><strong>Discover</strong><a href="#marketplace" onClick={() => browse()}>Marketplace</a><a href="#suppliers">Suppliers</a><a href="#how-it-works">How it works</a></div>
        <div className="footer-column"><strong>Your account</strong><button onClick={() => openAccount("login")}>{account ? "My account" : "Sign in"}</button>{!account && <button onClick={() => openAccount("signup")}>Create an account</button>}<button onClick={openSeller}>Become a seller</button></div>
      </div><div className="container footer-bottom"><span>Busineskal. Good business starts with a connection.</span></div></footer>
      {modal?.type === "auth" ? <AccountDialog key={modal.mode} initialMode={modal.mode} account={account} onAccount={setAccount} close={() => setModal(null)} /> : modal && <Dialog modal={modal} close={() => setModal(null)} />}
    </div>
  );
}
