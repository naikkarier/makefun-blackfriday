// DealHound hand-in for black-friday-deal-finder-01 (Node 22, standard
// library only). The site lives in app/ as plain static files: index.html,
// one stylesheet, and ES modules for the deals, the filtering and the
// rendering. Nothing loads over the network, and each deal links out to
// its store. This program copies app/ and screenshots/ from beside this
// file into the output directory and writes dossier.json there with the
// vendored make.fun library, which is what the scorer rebuilds and
// compares byte for byte. Leave vendor/makefun-frontend.ts untouched.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Serve the site locally with `node serve.ts`, then open http://localhost:8080.

import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Fail loudly instead of handing in an empty site: the app must have its
// index page, and screenshots must hold 3 or 4 images.
if (!existsSync(join(here, "app", "index.html"))) {
  throw new Error("app/index.html is missing, refusing to hand in");
}
const shotCount = existsSync(join(here, "screenshots"))
  ? readdirSync(join(here, "screenshots")).filter((f) => /\.(png|jpe?g)$/i.test(f)).length
  : 0;
if (shotCount < 3 || shotCount > 4) {
  throw new Error("screenshots/ must hold 3 or 4 images, found " + shotCount);
}

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// The scorer's caps: at most 4 screenshots, each at most 256 KiB; app/ at
// most 993 files and directories and 16 MiB in all; the dossier text at
// most 160 KiB. The library refuses an entry past any of them.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
