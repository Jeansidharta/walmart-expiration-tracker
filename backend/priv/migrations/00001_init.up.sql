CREATE TABLE Product (
	barcode TEXT PRIMARY KEY NOT NULL,
	creation_date INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
	name TEXT,
	image TEXT NOT NULL
) STRICT;

CREATE TABLE Item (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  creation_date INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  product_barcode TEXT NOT NULL REFERENCES Product(barcode),
  location TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 0
) STRICT;
