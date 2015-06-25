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
    lending_date date,
    delivery_date date
);
SELECT * from books;