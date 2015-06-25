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
name VARCHAR(30),
author VARCHAR(30),
editor VARCHAR(30),
genre VARCHAR(30),
number VARCHAR(30),
review TEXT
);
SELECT * from users;