import sharp from "sharp";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { fileTypeFromBuffer } from "file-type";
import type { Request, Response, NextFunction } from "express";

// ─── Config ───────────────────────────────────────────────────────────────────
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MIN_W = 100;
const MIN_H = 100;
const MAX_W = 5000;
const MAX_H = 5000;
const UPLOAD_DIR = "uploads/products";
const THUMB_DIR = "uploads/thumbnails";

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
fs.mkdirSync(THUMB_DIR, { recursive: true });

// ─── Perceptual Hash (8×8 DCT-style) ─────────────────────────────────────────
export async function computePHash(buffer: Buffer): Promise<string> {
  const { data } = await sharp(buffer)
    .resize(8, 8, { fit: "fill" })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels = Array.from(data);
  const avg = pixels.reduce((a, b) => a + b, 0) / pixels.length;
  const bits = pixels.map((p) => (p >= avg ? 1 : 0));

  // Pack 64 bits → 16 hex chars
  let hash = "";
  for (let i = 0; i < 64; i += 4) {
    const nibble =
      (bits[i] << 3) | (bits[i + 1] << 2) | (bits[i + 2] << 1) | bits[i + 3];
    hash += nibble.toString(16);
  }
  return hash;
}

/** Hamming distance between two hex pHash strings (0 = identical) */
export function hashDistance(a: string, b: string): number {
  if (a.length !== b.length) return Infinity;
  let dist = 0;
  for (let i = 0; i < a.length; i++) {
    const diff = parseInt(a[i], 16) ^ parseInt(b[i], 16);
    dist += diff.toString(2).split("").filter((c) => c === "1").length;
  }
  return dist;
}

// ─── Watermark SVG ────────────────────────────────────────────────────────────
function makeWatermarkSvg(w: number, h: number): Buffer {
  const size = Math.max(14, Math.min(w, h) / 16);
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <text
      x="50%" y="96%"
      text-anchor="middle"
      font-family="Arial, sans-serif"
      font-size="${size}"
      font-weight="bold"
      fill="rgba(255,255,255,0.6)"
      stroke="rgba(0,0,0,0.25)"
      stroke-width="0.5"
    >© Thrift</text>
  </svg>`;
  return Buffer.from(svg);
}

// ─── Main Middleware ───────────────────────────────────────────────────────────
export const processImage = async (
  req: Request & { file?: any },
  res: Response,
  next: NextFunction
) => {
  if (!req.file) return next();

  try {
    const buffer: Buffer = req.file.buffer;

    // 1. Magic-byte MIME check (defeats extension spoofing)
    const detected = await fileTypeFromBuffer(buffer);
    if (!detected || !ALLOWED_MIME.includes(detected.mime)) {
      return res.status(400).json({
        success: false,
        message: `Invalid file type (detected: ${detected?.mime ?? "unknown"}). Only JPEG, PNG, WebP and GIF are allowed.`,
      });
    }

    // 2. Dimension guard
    const meta = await sharp(buffer).metadata();
    const w = meta.width ?? 0;
    const h = meta.height ?? 0;

    if (w < MIN_W || h < MIN_H) {
      return res.status(400).json({
        success: false,
        message: `Image too small (${w}×${h}px). Minimum is ${MIN_W}×${MIN_H}px.`,
      });
    }
    if (w > MAX_W || h > MAX_H) {
      return res.status(400).json({
        success: false,
        message: `Image too large (${w}×${h}px). Maximum is ${MAX_W}×${MAX_H}px.`,
      });
    }

    // 3. Perceptual hash
    const imageHash = await computePHash(buffer);
    req.file.imageHash = imageHash;

    // 4. Strip EXIF + watermark + save full image (sharp strips metadata by default)
    const uid = uuidv4();
    const ext = detected.ext === "jpg" ? "jpg" : detected.ext;
    const filename = `product-${uid}.${ext}`;
    const filepath = path.join(UPLOAD_DIR, filename);

    const wmSvg = makeWatermarkSvg(w, h);
    await sharp(buffer)
      .composite([{ input: wmSvg, blend: "over" }])
      .toFile(filepath); // metadata stripped by default

    // 5. Thumbnail (200×200 cover crop, no watermark)
    const thumbFilename = `thumb-${uid}.${ext}`;
    const thumbPath = path.join(THUMB_DIR, thumbFilename);
    await sharp(buffer).resize(200, 200, { fit: "cover" }).toFile(thumbPath);

    // 6. Patch req.file so existing controller code works untouched
    req.file.filename = filename;
    req.file.path = filepath;
    req.file.thumbnailFilename = thumbFilename;
    req.file.thumbnailUrl = `/uploads/thumbnails/${thumbFilename}`;

    next();
  } catch (err) {
    console.error("[imageProcessor] error:", err);
    return res.status(500).json({
      success: false,
      message: "Image processing failed.",
    });
  }
};
