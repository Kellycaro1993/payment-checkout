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
    "customerId" INTEGER NOT NULL,
    "deliveryId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Transaction_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "TransactionStatus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Transaction_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "Delivery" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_Transaction" ("id", "productAmount", "baseFee", "deliveryFee", "totalAmount", "paymentId", "statusId", "customerId", "deliveryId", "createdAt", "updatedAt")
SELECT "id", "productAmount", "baseFee", "deliveryFee", "totalAmount", "paymentId", "statusId", "customerId", "deliveryId", "createdAt", "updatedAt" FROM "Transaction";

CREATE TABLE "transaction_item_backup" AS
SELECT "id" AS "transactionId", "productId", 1 AS "quantity", "productAmount" AS "unitPrice" FROM "Transaction";

DROP TABLE "Transaction";
ALTER TABLE "new_Transaction" RENAME TO "Transaction";
CREATE UNIQUE INDEX "Transaction_deliveryId_key" ON "Transaction"("deliveryId");

CREATE TABLE "TransactionItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "quantity" INTEGER NOT NULL,
    "unitPrice" INTEGER NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    CONSTRAINT "TransactionItem_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TransactionItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "TransactionItem" ("transactionId", "productId", "quantity", "unitPrice")
SELECT "transactionId", "productId", "quantity", "unitPrice" FROM "transaction_item_backup";
DROP TABLE "transaction_item_backup";
CREATE UNIQUE INDEX "TransactionItem_transactionId_productId_key" ON "TransactionItem"("transactionId", "productId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
