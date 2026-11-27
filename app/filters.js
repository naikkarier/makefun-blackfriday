// Filtering and sorting for DealHound. Pure functions: they take the deal
// list and a state object and return a new list, so the page can re-render
// from the URL hash without touching the data.

import { discountOf, savedOf } from "./data.js";

export const SORTS = {
  discount: "Biggest discount %",
  saved: "Biggest dollar saving",
  priceAsc: "Lowest price",
  priceDesc: "Highest price",
  verdict: "Best verdict first",
};

const VERDICT_RANK = { NEW_LOW: 0, STRONG: 1, GOOD: 2, ROUTINE: 3 };

export function filterDeals(deals, state) {
  const q = (state.q || "").trim().toLowerCase();
  const minPct = Number(state.minPct || 0);
  return deals.filter((deal) => {
    if (state.cat && state.cat !== "All" && deal.category !== state.cat) return false;
    if (state.store && state.store !== "All" && deal.store !== state.store) return false;
    if (discountOf(deal) < minPct) return false;
    if (q) {
      const hay = (deal.name + " " + deal.category + " " + deal.store + " " + deal.blurb).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function sortDeals(deals, sortKey) {
  const list = deals.slice();
  switch (sortKey) {
    case "discount":
      return list.sort((a, b) => discountOf(b) - discountOf(a) || savedOf(b) - savedOf(a));
    case "saved":
      return list.sort((a, b) => savedOf(b) - savedOf(a) || discountOf(b) - discountOf(a));
    case "priceAsc":
      return list.sort((a, b) => a.sale - b.sale);
    case "priceDesc":
      return list.sort((a, b) => b.sale - a.sale);
    case "verdict":
      return list.sort((a, b) => VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] || discountOf(b) - discountOf(a));
    default:
      return list.sort((a, b) => discountOf(b) - discountOf(a) || savedOf(b) - savedOf(a));
  }
}

export function applyAll(deals, state) {
  return sortDeals(filterDeals(deals, state), state.sort || "discount");
}

// Same product at more than one store: group by name so the detail page
// can show the cross-store comparison.
export function sameProduct(deals, deal) {
  return deals.filter((d) => d.name === deal.name && d.slug !== deal.slug);
}
