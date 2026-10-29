// Writes a compressed .webp beside every photo (the site serves these; the .jpg stays for social previews),
// plus smaller copies in 480/ and 960/ subfolders so phones and small slots download less.
// Run after adding or replacing a photo: npm run images
import sharp from "sharp";
import { readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = "public/images";
const jobs = [
  // [folder, longest side in px, quality, make smaller copies]
  ["yugharling", 1440, 62, true],
  ["yugharling/thumbs", 640, 68, false],
  ["resort", 1000, 64, true],
];
// Must match VARIANTS in src/data/site.ts
const variants = [480, 960];
// Width of each full-size .webp, read by srcset() in src/data/site.ts
const widths = {};

for (const [dir, max, quality, small] of jobs) {
  for (const file of readdirSync(join(root, dir)).filter((f) => /\.jpe?g$/i.test(f))) {
    const src = join(root, dir, file);
    const name = file.replace(/\.jpe?g$/i, ".webp");
    const info = await sharp(src)
      .rotate()
      .resize({ width: max, height: max, fit: "inside", withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(join(root, dir, name));
    if (!small) continue;
    widths[`${dir}/${name}`] = info.width;
    for (const w of variants.filter((w) => w < info.width)) {
      mkdirSync(join(root, dir, String(w)), { recursive: true });
      await sharp(src).rotate().resize({ width: w }).webp({ quality: quality + 4, effort: 6 }).toFile(join(root, dir, String(w), name));
    }
  }
}
writeFileSync("src/data/image-widths.json", JSON.stringify(widths, null, 2) + "\n");
await sharp(join(root, "logo.png")).webp({ quality: 85, alphaQuality: 90, effort: 6 }).toFile(join(root, "logo.webp"));
console.log("WebP images updated");
