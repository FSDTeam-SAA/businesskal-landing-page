"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Product } from "./marketplace";

function PreviewImage({ item }: { item: Product }) {
  const [failed, setFailed] = useState(false);
  return <Image src={!failed && item.image ? item.image : "/images/listing-placeholder.svg"} alt={item.name}
    fill unoptimized sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 25vw" onError={() => setFailed(true)} />;
}

export function ListingCollections({ listings, open, browse }: {
  listings: Product[]; open: (item: Product) => void; browse: (type: "Products" | "Services") => void;
}) {
  const products = listings.filter((item) => item.type === "Products");
  const services = listings.filter((item) => item.type === "Services");
  const best = products.filter((item) => (item.soldCount || 0) > 0).sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
  const collections = [
    { id: "products", label: "PRODUCT DISCOVERY", title: "Products for your next move.", text: "Explore published products, compare suppliers, and check pack sizes and minimum order quantities.", items: products.slice(0, 4), type: "Products" as const },
    { id: "services", label: "EXPERTISE FOR YOUR BUSINESS", title: "Find the service you need.", text: "Discover service providers by category and location. Explore their offering before taking your next step.", items: services.slice(0, 4), type: "Services" as const },
    ...(best.length ? [{ id: "best-sellers", label: "BASED ON RECORDED SALES", title: "Best sellers in the marketplace.", text: "Products ranked by their recorded sales, from highest to lowest.", items: best.slice(0, 4), type: "Products" as const }] : []),
    ...(products.length > 4 ? [{ id: "new-arrivals", label: "RECENTLY PUBLISHED", title: "Meet the latest arrivals.", text: "New product listings to explore, ordered by their creation date.", items: [...products].sort((a, b) => (Date.parse(b.createdAt || "") || 0) - (Date.parse(a.createdAt || "") || 0)).slice(0, 4), type: "Products" as const }] : []),
  ];
  return <>{collections.map((collection) => collection.items.length > 0 && <section className="section discovery-section" id={collection.id} key={collection.id}>
    <div className="container">
      <div className="section-heading"><div><span className="eyebrow">{collection.label}</span><h2>{collection.title}</h2><p>{collection.text}</p></div>
        <button className="text-link" onClick={() => browse(collection.type)}>Explore all {collection.type.toLowerCase()} <span aria-hidden="true">→</span></button></div>
      <div className="discovery-grid">{collection.items.map((item) => <article className="discovery-card" key={item.id}>
        <button className="discovery-image" onClick={() => open(item)} aria-label={`View ${item.name}`}><PreviewImage item={item} /><span className="discovery-label">{item.type === "Products" ? "Product" : "Service"}</span></button>
        <div className="discovery-body"><span className="eyebrow">{item.category}</span><h3><button onClick={() => open(item)}>{item.name}</button></h3><p>{item.supplier}{item.location ? ` · ${item.location}` : ""}</p>
          {item.type === "Products" ? <><strong className="discovery-price">{item.price}<small>{item.unit}</small></strong>{item.minOrderQty !== undefined && <small className="discovery-detail">Minimum order: {item.minOrderQty}</small>}</> : <span className="discovery-detail">Explore provider & service details</span>}
          {!!item.reviewsCount && !!item.rating && <span className="discovery-rating">★ {item.rating.toFixed(1)} · {item.reviewsCount} reviews</span>}
          <button className="discovery-action" onClick={() => open(item)}>View {item.type === "Products" ? "product" : "service"} <span aria-hidden="true">↗</span></button>
        </div>
      </article>)}</div>
    </div>
  </section>)}</>;
}

export function WhyBusineskal({ join, sell }: { join: () => void; sell: () => void }) {
  return <section className="section value-section" id="why-busineskal"><div className="container">
    <div className="section-heading"><div><span className="eyebrow">ONE MARKETPLACE. MORE WAYS TO GROW.</span><h2>Built around your business.</h2><p>Whether you are discovering an offering or bringing your own business online, start with the right information.</p></div></div>
    <div className="value-grid">{[
      { mark: "01", title: "Products & services", text: "Find physical products and professional services in one place, with clear categories and listing details." },
      { mark: "02", title: "Know who is behind it", text: "See the supplier name, country, and published offerings before choosing your next business connection." },
      { mark: "03", title: "A reviewed marketplace", text: "Seller applications need admin approval. Published catalogue listings are reviewed separately before appearing here." },
      { mark: "04", title: "A place for your business", text: "Apply with your business details. After approval, use the seller dashboard to manage your shop and offerings." },
    ].map((item) => <article className="value-card" key={item.mark}><span>{item.mark}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
    <div className="value-actions"><button className="button primary" onClick={join}>Join as a buyer <span aria-hidden="true">→</span></button><button className="button secondary" onClick={sell}>Bring your business online <span aria-hidden="true">→</span></button></div>
  </div></section>;
}

type Plan = { id: string; name: string; description: string; monthly: number; yearly: number; features: string[] };
export function SellerPlans({ apply }: { apply: () => void }) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [yearly, setYearly] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/seller-plans", { signal: controller.signal, cache: "no-store" }).then((response) => response.json())
      .then((result) => { if (!controller.signal.aborted && result.success && result.currency === "USD" && Array.isArray(result.data)) setPlans(result.data); })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  if (!plans.length) return null;
  return <section className="section plans-section live-plans" id="seller-plans"><div className="container">
    <div className="section-heading centered"><span className="eyebrow">AVAILABLE SELLER PLANS</span><h2>Choose a plan for your business.</h2><p>Explore current plan features and prices. Seller approval comes before activating a subscription.</p></div>
    <div className="billing-toggle" role="group" aria-label="Billing period"><button aria-pressed={!yearly} className={!yearly ? "active" : ""} onClick={() => setYearly(false)}>Monthly</button><button aria-pressed={yearly} className={yearly ? "active" : ""} onClick={() => setYearly(true)}>Yearly</button></div>
    <div className="plans-grid">{plans.map((plan) => <article className="plan-card" key={plan.id}><h3 className="live-plan-name">{plan.name}</h3><p>{plan.description}</p><strong className="live-plan-price">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(yearly ? plan.yearly : plan.monthly)}<small> / {yearly ? "year" : "month"}</small></strong><ul>{plan.features.map((feature, index) => <li key={`${index}-${feature}`}><span aria-hidden="true">✓</span>{feature}</li>)}</ul><button className="button secondary" onClick={apply}>Apply as a seller <span aria-hidden="true">→</span></button></article>)}</div>
    <p className="plans-note">Prices are in USD. Manage your subscription from the seller dashboard after your account is approved.</p>
  </div></section>;
}
