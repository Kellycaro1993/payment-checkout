/*
  Warnings:

  - You are about to drop the column `amount` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `baseFee` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deliveryFee` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productAmount` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "TransactionStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transaction" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productAmount" INTEGER NOT NULL,
    "baseFee" INTEGER NOT NULL,
    "deliveryFee" INTEGER NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "paymentId" TEXT,
    "statusId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "deliveryId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Transaction_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "TransactionStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Transaction" ("createdAt", "customerId", "deliveryId", "id", "paymentId", "productId", "updatedAt") SELECT "createdAt", "customerId", "deliveryId", "id", "paymentId", "productId", "updatedAt" FROM "Transaction";
DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE UNIQUE INDEX "Transaction_deliveryId_key" ON "Transaction"("deliveryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "TransactionStatus_name_key" ON "TransactionStatus"("name");
