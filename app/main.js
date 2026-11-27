// Boot and routing for DealHound. The page state lives in the URL hash,
// so every view is a link: #/ for the list, #/?cat=Audio&store=Amazon for
// a filtered list, #/deal/<slug> for one deal's page. Changing a control
// rewrites the hash, and the hash drives the render.

import { DEALS, CATEGORIES, STORES, CHECKED_DATE, discountOf, savedOf, money } from "./data.js";
import { SORTS, applyAll } from "./filters.js";
import { dealCard, dealDetail, emptyState } from "./render.js";

const grid = document.getElementById("grid");
const countLine = document.getElementById("count-line");
const statsBar = document.getElementById("stats");
const searchBox = document.getElementById("search");
const catRow = document.getElementById("cat-row");
const storeSel = document.getElementById("store");
const minSel = document.getElementById("min-discount");
const sortSel = document.getElementById("sort");
const clearBtn = document.getElementById("clear-filters");

function readHash() {
  const raw = location.hash.replace(/^#\/?/, "");
  if (raw.startsWith("deal/")) {
    return { view: "deal", slug: raw.slice(5).split("?")[0] };
  }
  const params = new URLSearchParams(raw.split("?")[1] || "");
  return {
    view: "list",
    q: params.get("q") || "",
    cat: params.get("cat") || "All",
    store: params.get("store") || "All",
    minPct: params.get("min") || "0",
    sort: params.get("sort") || "discount",
  };
}

function writeHash(state) {
  const params = new URLSearchParams();
  if (state.q) params.set("q", state.q);
  if (state.cat && state.cat !== "All") params.set("cat", state.cat);
  if (state.store && state.store !== "All") params.set("store", state.store);
  if (state.minPct && state.minPct !== "0") params.set("min", state.minPct);
  if (state.sort && state.sort !== "discount") params.set("sort", state.sort);
  const query = params.toString();
  location.hash = "#/" + (query ? "?" + query : "");
}

function renderStats(list) {
  const best = list.length ? Math.max.apply(null, list.map(discountOf)) : 0;
  const total = list.reduce((sum, d) => sum + savedOf(d), 0);
  statsBar.innerHTML =
    "<span><strong>" + list.length + "</strong> deals shown</span>" +
    "<span>Best discount <strong>-" + best + "%</strong></span>" +
    "<span>Total savings <strong>" + money(total) + "</strong></span>" +
    "<span>All prices checked <strong>" + CHECKED_DATE + "</strong></span>";
}

function renderList(state) {
  const list = applyAll(DEALS, state);
  renderStats(list);
  countLine.textContent =
    list.length + " of " + DEALS.length + " deals" +
    (state.cat !== "All" ? " in " + state.cat : "") +
    (state.store !== "All" ? " at " + state.store : "") +
    (state.minPct !== "0" ? ", at least -" + state.minPct + "%" : "") +
    (state.q ? ', matching "' + state.q + '"' : "");
  grid.innerHTML = list.length ? list.map(dealCard).join("") : emptyState();
  document.getElementById("detail").innerHTML = "";
  grid.hidden = false;
}

function renderDeal(slug) {
  const deal = DEALS.find((d) => d.slug === slug);
  if (!deal) {
    grid.innerHTML = emptyState();
    return;
  }
  renderStats(DEALS);
  countLine.textContent = "One deal: " + deal.name;
  grid.innerHTML = "";
  grid.hidden = true;
  document.getElementById("detail").innerHTML = dealDetail(deal, DEALS);
  window.scrollTo(0, 0);
}

function syncControls(state) {
  searchBox.value = state.q || "";
  storeSel.value = state.store || "All";
  minSel.value = state.minPct || "0";
  sortSel.value = state.sort || "discount";
  catRow.querySelectorAll("button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.cat === (state.cat || "All"));
  });
}

function render() {
  const state = readHash();
  if (state.view === "deal") {
    syncControls({ q: "", cat: "All", store: "All", minPct: "0", sort: "discount" });
    renderDeal(state.slug);
    return;
  }
  syncControls(state);
  renderList(state);
}

function buildControls() {
  ["All"].concat(CATEGORIES).forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.cat = cat;
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      const state = readHash();
      state.cat = cat;
      writeHash(state);
    });
    catRow.appendChild(btn);
  });
  STORES.forEach((store) => {
    const opt = document.createElement("option");
    opt.value = store;
    opt.textContent = store;
    storeSel.appendChild(opt);
  });
  Object.keys(SORTS).forEach((key) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = SORTS[key];
    sortSel.appendChild(opt);
  });
  let timer = null;
  searchBox.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const state = readHash();
      state.q = searchBox.value;
      writeHash(state);
    }, 200);
  });
  storeSel.addEventListener("change", () => {
    const state = readHash();
    state.store = storeSel.value;
    writeHash(state);
  });
  minSel.addEventListener("change", () => {
    const state = readHash();
    state.minPct = minSel.value;
    writeHash(state);
  });
  sortSel.addEventListener("change", () => {
    const state = readHash();
    state.sort = sortSel.value;
    writeHash(state);
  });
  clearBtn.addEventListener("click", () => {
    location.hash = "#/";
  });
}

buildControls();
window.addEventListener("hashchange", render);
render();
