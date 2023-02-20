const fs = require("fs");
const bundlePath = "./assets/bundle.js";

const js = [
  "./tail.js",
  "./tail.modal.js",
  "./tail.popup.js",
  "./tail.accordion.js",
  "./tail.carousel.js",
  "./tail.cart.js",
  "./tail.drawer.js",
  "./tail.tabs.js",
  "./tail.details.js",
  "./tail.marquee.js",
  "./tail.atc.js",
  "./tail.megamenu.js",
  "./tail.filters.js",
  "./tail.variants.js",
  "./tail.account.js",
  "./tail.results.js"
  // "./tail.algolia.js"
]
  .map((path) => fs.readFileSync("./assets/" + path).toString())
  .join("\n");
fs.writeFileSync(bundlePath, js);

require("esbuild").buildSync({
  entryPoints: [bundlePath],
  outfile: "./assets/components.min.js",
  target: ["chrome58"],
  bundle: true,
  minifySyntax: true,
  minifyIdentifiers: true,
  minifyWhitespace: true,
  minify: true,
  write: true
});

const tailwind = fs.readFileSync("./assets/tailwind.min.css");
const tailwindApply = fs.readFileSync("./assets/tailwind.apply.min.css");
const components = fs.readFileSync("./assets/components.min.js");
const critical = fs.readFileSync("./assets/critical.css");
// const custom = fs.readFileSync("./assets/custom.css");
// const fonts = fs.readFileSync("./assets/fonts.css").toString();

// const fontsInLiquid = fonts.replace(/[^url]*\(.*?\)/g, (match) => {
//   if (match.includes("mat")) {
//     return match;
//   }
//   return `({{ ${match.replace("(", "").replace(")", "")} | asset_url }})`;
// });

const style = `<style data-update="${new Date().toISOString()}">
${tailwind}
${tailwindApply}
${critical}
</style>`;

const javascript = `<script data-update="${new Date().toISOString()}">
${components}
</script>`;
fs.writeFileSync("./snippets/styles.liquid", style);
fs.writeFileSync("./snippets/scripts.liquid", javascript);

fs.rmSync(bundlePath);
