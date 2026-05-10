-- AlterEnum
ALTER TYPE "ProductStatus" ADD VALUE 'FLAGGED';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "imageHash" TEXT,
ADD COLUMN     "thumbnailUrl" TEXT;
