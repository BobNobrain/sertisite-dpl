CREATE DATABASE test;
USE test;

CREATE TABLE testtab (
	id INTEGER AUTO_INCREMENT,
	name TEXT,
	PRIMARY KEY (id)
) COMMENT='this is my test table';

CREATE DATABASE prod;
USE prod;

CREATE TABLE companies (
	company_id INTEGER AUTO_INCREMENT,
	name VARCHAR(200) NOT NULL,
	ogrn CHAR(13) NOT NULL,
	inn VARCHAR(12) NOT NULL,
	PRIMARY KEY (company_id),
	UNIQUE (ogrn),
	UNIQUE (inn)
) COMMENT='info about companies here';
ALTER TABLE companies ADD INDEX (ogrn);
ALTER TABLE companies ADD INDEX (inn);

CREATE TABLE types (
	type_id INTEGER AUTO_INCREMENT,
	type_name VARCHAR(25) NOT NULL,
	PRIMARY KEY (type_id)
) COMMENT='just enum for booking types';

CREATE TABLE bookings (
	id INTEGER AUTO_INCREMENT,
	company_id INTEGER NOT NULL,
	type_id TINYINT NOT NULL,
	book_date DATE NOT NULL,
	book_time TINYINT NOT NULL,
	PRIMARY KEY (id),
	UNIQUE (book_date, book_time)
) COMMENT='all bookings made by companies are stored here';
ALTER TABLE bookings ADD INDEX (book_date, book_time);

# and filling enum
INSERT INTO types VALUES (1, "Obtain");
INSERT INTO types VALUES (2, "Refresh");
INSERT INTO types VALUES (3, "Deny");

