// Rendering for DealHound: turns deals into HTML strings. No framework,
// no images: each card carries a colored letter tile drawn with CSS, so the
// site needs no media files at all.

import { VERDICTS, discountOf, savedOf, money } from "./data.js";
import { sameProduct } from "./filters.js";

const TILE_COLORS = {
  Audio: "#7c3aed",
  Laptops: "#0369a1",
  "TVs & Monitors": "#0f766e",
  Phones: "#be185d",
  "Tablets & Wearables": "#b45309",
  Home: "#15803d",
  "Streaming & Accessories": "#334155",
};

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function verdictBadge(deal) {
  const v = VERDICTS[deal.verdict];
  return '<span class="verdict verdict-' + deal.verdict.toLowerCase().replace("_", "-") + '">' + v.label + "</span>";
}

export function dealCard(deal) {
  const pct = discountOf(deal);
  const saved = savedOf(deal);
  const color = TILE_COLORS[deal.category] || "#334155";
  const initial = deal.name.replace(/^(Apple|Samsung|Sony|Google|Lenovo|HP|LG|TCL|Bose|Dyson|iRobot|Ring|Ninja)\s+/, "").charAt(0);
  return (
    '<article class="card">' +
    '<a class="card-link" href="#/deal/' + deal.slug + '">' +
    '<div class="tile" style="background:' + color + '">' + esc(initial) + "</div>" +
    '<div class="card-body">' +
    '<div class="card-top"><span class="cat">' + esc(deal.category) + '</span><span class="store">' + esc(deal.store) + "</span></div>" +
    '<h3>' + esc(deal.name) + "</h3>" +
    '<p class="blurb">' + esc(deal.blurb) + "</p>" +
    '<div class="prices"><span class="sale">' + money(deal.sale) + '</span><span class="was">' + money(deal.was) + '</span><span class="pct">-' + pct + "%</span></div>" +
    '<div class="card-meta">' + verdictBadge(deal) + '<span class="save">Save ' + money(saved) + "</span></div>" +
    '<p class="checked">Checked ' + esc(deal.checked) + " &middot; " + esc(deal.source) + "</p>" +
    "</div></a>" +
    '<a class="buy" href="' + esc(deal.link) + '" target="_blank" rel="noopener">View at ' + esc(deal.store) + " &rarr;</a>" +
    "</article>"
  );
}

export function dealDetail(deal, deals) {
  const pct = discountOf(deal);
  const saved = savedOf(deal);
  const v = VERDICTS[deal.verdict];
  const color = TILE_COLORS[deal.category] || "#334155";
  const initial = deal.name.replace(/^(Apple|Samsung|Sony|Google|Lenovo|HP|LG|TCL|Bose|Dyson|iRobot|Ring|Ninja)\s+/, "").charAt(0);
  const others = sameProduct(deals, deal);
  let compare = "";
  if (others.length) {
    compare =
      "<h3>Same product at another store</h3><ul class=\"compare\">" +
      others
        .map(
          (o) =>
            "<li><strong>" + esc(o.store) + "</strong>: " + money(o.sale) + " (was " + money(o.was) + ", -" + discountOf(o) + "%) " +
            '<a href="' + esc(o.link) + '" target="_blank" rel="noopener">View at ' + esc(o.store) + " &rarr;</a></li>"
        )
        .join("") +
      "</ul>";
  }
  return (
    '<div class="detail">' +
    '<p class="back"><a href="#/">&larr; Back to all deals</a></p>' +
    '<div class="detail-head"><div class="tile big" style="background:' + color + '">' + esc(initial) + "</div>" +
    "<div><div class=\"card-top\"><span class=\"cat\">" + esc(deal.category) + '</span><span class="store">' + esc(deal.store) + "</span></div>" +
    "<h2>" + esc(deal.name) + "</h2><p class=\"blurb\">" + esc(deal.blurb) + "</p></div></div>" +
    '<div class="detail-prices"><div><span class="label">Sale price</span><span class="sale big">' + money(deal.sale) + "</span></div>" +
    '<div><span class="label">Usual price</span><span class="was big">' + money(deal.was) + "</span></div>" +
    '<div><span class="label">You save</span><span class="save big">' + money(saved) + " (-" + pct + "%)</span></div></div>" +
    '<div class="verdict-box">' + verdictBadge(deal) + "<p>" + v.note + "</p></div>" +
    '<p class="checked">Price checked ' + esc(deal.checked) + " at the store named above, read in the deals roundup: " + esc(deal.source) + ". Prices move by the hour, so check the live price before you pay.</p>" +
    '<p><a class="buy big" href="' + esc(deal.link) + '" target="_blank" rel="noopener">View at ' + esc(deal.store) + " &rarr;</a></p>" +
    compare +
    "</div>"
  );
}

export function emptyState() {
  return '<p class="empty">No deals match those filters. Clear the search or pick another category.</p>';
}
