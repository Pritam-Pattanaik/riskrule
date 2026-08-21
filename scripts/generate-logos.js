import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MASTER_IMAGE = 'C:/Users/HP/.gemini/antigravity-ide/brain/3fb4e05e-7b65-40dd-9b82-1a2957f4b6ff/media__1786531260845.png';
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const ASSETS_DIR = path.resolve(__dirname, '../src/assets/images');

// Ensure directories exist
if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });

const sizes = [16, 24, 32, 48, 64, 96, 128, 180, 192, 256, 384, 512];

async function generateAssets() {
  console.log('Starting asset generation...');
  
  try {
    // 1. Generate Favicon SVG (embedding base64 of high-res PNG for perfect vector-container rendering)
    const base64png = (await sharp(MASTER_IMAGE).resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()).toString('base64');
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <image href="data:image/png;base64,${base64png}" width="512" height="512" />
</svg>`;
    fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), svgContent);
    fs.writeFileSync(path.join(ASSETS_DIR, 'logo.svg'), svgContent);
    console.log('Generated favicon.svg & logo.svg');

    // 2. Generate standard sizes for WebP and PNG
    for (const size of sizes) {
      // Create PNG
      await sharp(MASTER_IMAGE)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toFile(path.join(PUBLIC_DIR, `icon-${size}x${size}.png`));
      
      // Create WebP (Highly optimized)
      await sharp(MASTER_IMAGE)
        .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp({ quality: 100, lossless: true })
        .toFile(path.join(PUBLIC_DIR, `icon-${size}x${size}.webp`));
        
      console.log(`Generated ${size}x${size} PNG & WebP`);
    }

    // 3. Apple Touch Icon
    await sharp(MASTER_IMAGE)
      .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(PUBLIC_DIR, 'apple-touch-icon.png'));
    console.log('Generated apple-touch-icon.png');

    // 4. Open Graph Image (1200x630, centered)
    await sharp(MASTER_IMAGE)
      .resize(1200, 630, { fit: 'contain', background: { r: 10, g: 14, b: 23, alpha: 1 } }) // Dark background for OG
      .png()
      .toFile(path.join(PUBLIC_DIR, 'og-image.png'));
    console.log('Generated og-image.png');

    // 5. Generate Primary Logo for UI
    await sharp(MASTER_IMAGE)
      .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 100, lossless: true })
      .toFile(path.join(ASSETS_DIR, 'logo-primary.webp'));
    console.log('Generated logo-primary.webp');
    
    // 6. Generate Favicon ICO using png-to-ico (16, 32, 48)
    const buf = await pngToIco([
      path.join(PUBLIC_DIR, 'icon-16x16.png'),
      path.join(PUBLIC_DIR, 'icon-32x32.png'),
      path.join(PUBLIC_DIR, 'icon-48x48.png')
    ]);
    fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), buf);
    console.log('Generated favicon.ico');

    console.log('All assets generated successfully!');
  } catch (error) {
    console.error('Error generating assets:', error);
  }
}

generateAssets();
