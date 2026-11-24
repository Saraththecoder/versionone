import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGES_DIR = path.join(__dirname, "..", "public", "images");

const ASSETS = [
  { svg: "splash-bus.svg", png: "splash-bus.png", width: 840, height: 560 },
  { svg: "driver-banner.svg", png: "driver-banner.png", width: 920, height: 560 },
  { svg: "icon-driver.svg", png: "icon-driver.png", width: 512, height: 512 },
  { svg: "icon-school.svg", png: "icon-school.png", width: 512, height: 512 },
  { svg: "icon-student.svg", png: "icon-student.png", width: 512, height: 512 },
  { svg: "icon-bus.svg", png: "icon-bus.png", width: 512, height: 512 },
];

async function generateAll() {
  for (const asset of ASSETS) {
    const svgPath = path.join(IMAGES_DIR, asset.svg);
    const pngPath = path.join(IMAGES_DIR, asset.png);

    if (!fs.existsSync(svgPath)) {
      console.warn(`File not found: ${svgPath}`);
      continue;
    }

    try {
      await sharp(svgPath, { density: 300 })
        .resize(asset.width, asset.height, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png({ compressionLevel: 8, quality: 100 })
        .toFile(pngPath);

      const stats = fs.statSync(pngPath);
      console.log(
        `Generated ${asset.png} (${stats.size} bytes, ${asset.width}x${asset.height} @ 300dpi)`
      );
    } catch (err) {
      console.error(`Failed to generate ${asset.png}:`, err);
    }
  }
}

generateAll().then(() => console.log("All 3D avatars and bus PNGs generated successfully!"));
