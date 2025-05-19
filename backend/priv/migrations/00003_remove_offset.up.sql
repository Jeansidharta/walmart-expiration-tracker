CREATE TABLE ProductLocation (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  product_barcode TEXT NOT NULL REFERENCES Product(barcode),
  location TEXT NOT NULL REFERENCES Location(location),
  last_update INTEGER,

  UNIQUE (product_barcode, location)
) STRICT;

INSERT INTO ProductLocation  
	(product_barcode, location)
SELECT
	PermanentProductLocation.product_barcode, location.location
FROM PermanentProductLocation
JOIN Location ON (
  Location.register = PermanentProductLocation.register AND
  Location.register_offset = PermanentProductLocation.register_offset
)
WHERE Location.register_offset is not null;

INSERT OR REPLACE INTO ProductLocation (product_barcode, location, last_update)
SELECT product_barcode, location, last_update
FROM LocationProduct;

DROP TABLE LocationProduct;
DROP TABLE PermanentProductLocation;

CREATE TABLE Expiration (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  creation_date INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  product_location_id INTEGER NOT NULL REFERENCES ProductLocation(id),
  expires_at INTEGER NOT NULL
) STRICT;

INSERT INTO Expiration (creation_date, expires_at, product_location_id)
SELECT creation_date, expires_at, ProductLocation.id as product_location_id 
FROM Item
JOIN ProductLocation ON (
  ProductLocation.product_barcode = item.product_barcode AND
  ProductLocation.location = item.location
);

DROP TABLE Item;
