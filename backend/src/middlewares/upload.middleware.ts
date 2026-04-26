import multer from "multer";

/**
 * Uses memory storage so the imageProcessor middleware can inspect
 * the raw buffer (magic-byte MIME check, dimensions, pHash) before
 * writing the processed file to disk.
 */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});
