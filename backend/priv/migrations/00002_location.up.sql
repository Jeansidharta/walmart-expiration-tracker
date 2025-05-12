CREATE TABLE Location (
  location TEXT NOT NULL PRIMARY KEY,
  register INTEGER,
  register_offset INTEGER,
  isle INTEGER NOT NULL,
  shelf INTEGER NOT NULL,
  section TEXT NOT NULL
) STRICT;

CREATE INDEX RegisterIndex on Location (register);

INSERT INTO Location (location, register, shelf, isle, section, register_offset) VALUES
	------ Register 1 -------
	-- Left
	('Z2-1', 1, 1, 2, 'Z', NULL),
	('Z2-2', 1, 2, 2, 'Z', NULL),
	('Z2-3', 1, 3, 2, 'Z', NULL),
	('Z2-4', 1, 4, 2, 'Z', NULL),
	-- Right
	('Z3-1', 1, 1, 3, 'Z', 3),
	('Z3-2', 1, 2, 3, 'Z', 4),
	('Z3-3', 1, 3, 3, 'Z', 5),
	('Z3-200', 1, 200, 3, 'Z', 6),
	------ Register 2 -------
	-- Left
	('Z4-1', 2, 1, 4, 'Z', 0),
	('Z4-2', 2, 2, 4, 'Z', 1),
	('Z4-3', 2, 3, 4, 'Z', 2),
	-- Right
	('Z5-1', 2, 1, 5, 'Z', 3),
	('Z5-2', 2, 2, 5, 'Z', 4),
	('Z5-3', 2, 3, 5, 'Z', 5),
	('Z5-200', 2, 200, 5, 'Z', 6),
	------ Register 3 -------
	-- Left
	('Z6-1', 3, 1, 6, 'Z', 0),
	('Z6-2', 3, 2, 6, 'Z', 1),
	('Z6-3', 3, 3, 6, 'Z', 2),
	-- Right
	('Z7-1', 3, 1, 7, 'Z', 3),
	('Z7-2', 3, 2, 7, 'Z', 4),
	('Z7-3', 3, 3, 7, 'Z', 5),
	('Z7-200', 3, 200, 7, 'Z', 6),
	------ Register 4 -------
	-- Left
	('Z8-1', 4, 1, 8, 'Z', 0),
	('Z8-2', 4, 2, 8, 'Z', 1),
	('Z8-3', 4, 3, 8, 'Z', 2),
	-- Right
	('Z9-1', 4, 1, 9, 'Z', 3),
	('Z9-2', 4, 2, 9, 'Z', 4),
	('Z9-3', 4, 3, 9, 'Z', 5),
	('Z9-200', 4, 200, 9, 'Z', 6),
	------ Register 5 -------
	-- Left
	('Z10-1', 5, 1, 10, 'Z', 0),
	('Z10-2', 5, 2, 10, 'Z', 1),
	('Z10-3', 5, 3, 10, 'Z', 2),
	-- Right
	('Z11-1', 5, 1, 11, 'Z', 3),
	('Z11-2', 5, 2, 11, 'Z', 4),
	('Z11-3', 5, 3, 11, 'Z', 5),
	('Z11-200', 5, 200, 11, 'Z', 6),
	------ Register 6 -------
	-- Left
	('Z12-1', 6, 1, 12, 'Z', 0),
	('Z12-2', 6, 2, 12, 'Z', 1),
	('Z12-3', 6, 3, 12, 'Z', 2),
	-- Right
	('Z13-1', 6, 1, 13, 'Z', 3),
	('Z13-2', 6, 2, 13, 'Z', 4),
	('Z13-3', 6, 3, 13, 'Z', 5),
	('Z13-200', 6, 200, 13, 'Z', 6),
	------ Register 7 -------
	-- Left
	('Z14-1', 7, 1, 14, 'Z', 0),
	('Z14-2', 7, 2, 14, 'Z', 1),
	('Z14-3', 7, 3, 14, 'Z', 2),
	-- Right
	('Z15-1', 7, 1, 15, 'Z', 3),
	('Z15-2', 7, 2, 15, 'Z', 4),
	('Z15-3', 7, 3, 15, 'Z', 5),
	('Z15-200', 7, 200, 15, 'Z', 6),
	------ Register 8 -------
	-- Left
	('Z16-1', 8, 1, 16, 'Z', 0),
	('Z16-2', 8, 2, 16, 'Z', 1),
	('Z16-3', 8, 3, 16, 'Z', 2),
	-- Right
	('Z17-1', 8, 1, 17, 'Z', 3),
	('Z17-2', 8, 2, 17, 'Z', 4),
	('Z17-3', 8, 3, 17, 'Z', 5),
	('Z17-200', 8, 200, 17, 'Z', 6),
	------ Register 9 -------
	-- Left
	('Z18-1', 9, 1, 18, 'Z', 0),
	('Z18-2', 9, 2, 18, 'Z', 1),
	('Z18-3', 9, 3, 18, 'Z', 2),
	-- Right
	('Z19-1', 9, 1, 19, 'Z', 3),
	('Z19-2', 9, 2, 19, 'Z', 4),
	('Z19-3', 9, 3, 19, 'Z', 5),
	('Z19-200', 9, 200, 19, 'Z', 6),
	------ Register 10 -------
	-- Left
	('Z20-1', 10, 1, 20, 'Z', 0),
	('Z20-2', 10, 2, 20, 'Z', 1),
	('Z20-3', 10, 3, 20, 'Z', 2),
	-- Right
	('Z21-1', 10, 1, 21, 'Z', 3),
	('Z21-2', 10, 2, 21, 'Z', 4),
	('Z21-3', 10, 3, 21, 'Z', 5),
	('Z21-200', 10, 200, 21, 'Z', 6),
	------ Register 11 -------
	-- Left
	('Z22-1', 11, 1, 22, 'Z', 0),
	('Z22-2', 11, 2, 22, 'Z', 1),
	('Z22-3', 11, 3, 22, 'Z', 2),
	-- Right
	('Z23-1', 11, 1, 23, 'Z', 3),
	('Z23-2', 11, 2, 23, 'Z', 4),
	('Z23-3', 11, 3, 23, 'Z', 5),
	('Z23-200', 11, 200, 23, 'Z', 6),
	------ Register 12 -------
	-- Left
	('Z24-1', 12, 1, 24, 'Z', 0),
	('Z24-2', 12, 2, 24, 'Z', 1),
	('Z24-3', 12, 3, 24, 'Z', 2),
	-- Right
	('Z25-1', 12, 1, 25, 'Z', 3),
	('Z25-2', 12, 2, 25, 'Z', 4),
	('Z25-3', 12, 3, 25, 'Z', 5),
	('Z25-200', 12, 200, 25, 'Z', 6),
	------ Register 13 -------
	-- Left
	('Z26-1', 13, 1, 26, 'Z', 0),
	('Z26-2', 13, 2, 26, 'Z', 1),
	('Z26-3', 13, 3, 26, 'Z', 2),
	-- Right
	('Z27-1', 13, 1, 27, 'Z', 3),
	('Z27-2', 13, 2, 27, 'Z', 4),
	('Z27-3', 13, 3, 27, 'Z', 5),
	('Z27-4', 13, 4, 27, 'Z', 6),
	('Z27-5', 13, 5, 27, 'Z', NULL),
	('Z27-6', 13, 6, 27, 'Z', NULL),
	('Z27-7', 13, 7, 27, 'Z', NULL),
	('Z27-8', 13, 8, 27, 'Z', NULL),
	('Z27-9', 13, 9, 27, 'Z', NULL),
	('Z27-10', 13, 10, 27, 'Z', NULL),
	('Z27-11', 13, 11, 27, 'Z', NULL),
	('Z27-12', 13, 12, 27, 'Z', NULL);

CREATE TABLE LocationProduct (
  product_barcode TEXT NOT NULL REFERENCES Product(barcode),
  location TEXT NOT NULL REFERENCES Location(location),
  last_update INTEGER NOT NULL DEFAULT (unixepoch() * 1000),

  PRIMARY KEY (product_barcode, location) ON CONFLICT REPLACE
) STRICT;

INSERT INTO LocationProduct (product_barcode, location, last_update)
	SELECT product_barcode, location, creation_date as last_update from Item;

-- Remake the Item table to have a location referencing the Location table

CREATE TABLE _Item (
  id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  creation_date INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  product_barcode TEXT NOT NULL REFERENCES Product(barcode),
  location TEXT NOT NULL REFERENCES Location(location),
  expires_at INTEGER NOT NULL
) STRICT;

INSERT INTO _Item
	(id, creation_date, product_barcode, location, expires_at)
SELECT
	id, creation_date, product_barcode, location, expires_at
FROM Item;

DROP TABLE Item;

ALTER TABLE _Item RENAME TO Item;

CREATE TABLE PermanentProductLocation (
  product_barcode TEXT NOT NULL REFERENCES Product(barcode),
  register_offset INTEGER NOT NULL,
  register INTEGER NOT NULL,

  PRIMARY KEY (product_barcode, register) ON CONFLICT IGNORE
) STRICT;

INSERT INTO PermanentProductLocation (product_barcode, register_offset, register)
  SELECT product_barcode, register_offset, RightLocation.register
  FROM Item
  JOIN Location ON Item.location = Location.location
  RIGHT JOIN (SELECT register FROM Location WHERE register != 1) as RightLocation;
