USE ynov_ci;
CREATE TABLE utilisateur
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(100),
    username VARCHAR(100),
    email VARCHAR(255),
    city VARCHAR(255),
    postal_code VARCHAR(5)
);
DESCRIBE utilisateur;