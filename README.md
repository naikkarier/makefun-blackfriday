# DealHound: Real Black Friday Deal Finder

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/naikkarier/makefun-blackfriday/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/naikkarier/makefun-blackfriday/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01)

A Black Friday and Cyber Monday deal finder for the [make.fun](https://make.fun/bounty/black-friday-deal-finder-01) bounty "Build the best real Black Friday deal finder". It lists 31 real deals, each with its product, store, sale price, usual price, discount, store link and check time, with search and filters by category, store and discount, plus an honest verdict on whether each cut is really a deal.

## The deals

Every price was read on 27 Nov 2026 from a deals roundup that names the store, and each card says which roundup it came from. The verdicts are honest calls: NEW LOW (lowest recorded price of 2026), STRONG DEAL (a deep cut on a current product), GOOD DEAL (a real saving, not the deepest), ROUTINE SALE (a modest cut, only worth it if you already planned to buy it). Store links open the store's own search for the exact product.

## How it runs

The site is plain static files under `app/` with no build step: `index.html`, `style.css`, and ES modules `data.js` (the 31 deals), `filters.js` (filtering and sorting), `render.js` (cards and the detail page) and `main.js` (boot and hash routing). It works offline from its own files; nothing loads over the network. Views are hash routes: `#/` for the list, `#/?cat=Audio` for a filtered list, `#/deal/<slug>` for one deal.

Serve it locally with `node serve.ts`, then open http://localhost:8080.

## Hand-in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library (`vendor/makefun-frontend.ts`, copied from the kit unchanged).
