create database amoxtli;
use amoxtli;
DROP table users;
CREATE table users( 
	id INT auto_increment PRIMARY KEY NOT NULL,
	names VARCHAR(30) NOT NULL,
    last_names VARCHAR(30) NOT NULL,
    username VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    password VARCHAR(30) NOT NULL,
    facebook_id VARCHAR(30)
);
CREATE table admins( 
	id INT auto_increment PRIMARY KEY NOT NULL,
    username VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL,
    password VARCHAR(30) NOT NULL
);
drop table admins;
CREATE table books(
id INT auto_increment PRIMARY KEY NOT NULL,
name VARCHAR(30) NOT NULL,
author VARCHAR(30) NOT NULL,
editor VARCHAR(30) NOT NULL,
genre VARCHAR(30) NOT NULL,
number VARCHAR(30) NOT NULL,
review TEXT
);
drop table books;
create table lendings(
	id INT auto_increment PRIMARY KEY NOT NULL,
    id_user INT references users.id,
    id_book INT references book.id,
    confirmation boolean DEFAULT false,
    lending_date datetime,
    delivery_date datetime
);
drop table lendings;

create table reports(
	id INT auto_increment PRIMARY KEY NOT NULL,
    id_user INT references users.id,
    id_book INT references book.id,
    lending_date datetime,
    delivery_date datetime
);
drop table reports;

CREATE TABLE chats(
	id INT NOT NULL,
    user_id  INT references users.id
)

SELECT * FROM lendings;

SELECT * from lendings l INNER JOIN users u ON l.id_user = u.id INNER JOIN books b ON l.id_book = b.id;

DELIMITER //
CREATE PROCEDURE confirmLending(lending_id INT)
BEGIN
	DECLARE bid INT;
	SELECT id_book INTO bid from lendings WHERE lendings.id = lending_id;
	UPDATE lendings SET lendings.confirmation = true WHERE lendings.id = lending_id;
    UPDATE books SET number = (number - 1) WHERE id = bid;
END 
//
DELIMITER ;
DELIMITER //
CREATE PROCEDURE getLendings()
BEGIN
	SELECT  l.id AS lending_id,
		l.id_user as id_user,
		l.id_book AS id_book,
		l.confirmation AS confirmation,
		l.lending_date AS lending_date,
		l.delivery_date AS delivery_date,
		u.id AS user_id,
		u.username AS username,
		b.id AS book_id,
		b.name AS book_name
	FROM lendings l 
	INNER JOIN users u ON l.id_user = u.id 
	INNER JOIN books b ON l.id_book = b.id 
	WHERE l.confirmation = 0;
END
//
DELIMITER ;
DELIMITER //
CREATE PROCEDURE getUserLendings(id_user INT)
BEGIN
	SELECT  l.id AS lending_id,
		l.id_user as id_user,
		l.id_book AS id_book,
		l.confirmation AS confirmation,
		l.lending_date AS lending_date,
		l.delivery_date AS delivery_date,
		u.id AS user_id,
		u.username AS username,
		b.id AS book_id,
		b.name AS book_name
	FROM lendings l 
	INNER JOIN users u ON l.id_user = u.id 
	INNER JOIN books b ON l.id_book = b.id 
	WHERE l.confirmation = 1 AND l.id_user = id_user;
END
//
DELIMITER ;


call confirmLending(3);
call getLendings();
call getUserLendings(3);

DROP PROCEDURE confirmLending;
DROP PROCEDURE getLendings;
DROP PROCEDURE getUserLendings;

SELECT * from books;
select * from users;
select * from admins;

INSERT INTO admins VALUES(1,'tugefa','a','a');

SELECT * from lendings AS l INNER JOIN users AS u ON l.id_user = u.id INNER JOIN books AS b ON l.id_book = b.id WHERE confirmation = 0;

SELECT id_book into bid from lendings WHERE lendings.id = lending_id;