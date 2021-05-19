CREATE DATABASE `peliculas`;

USE `peliculas`;

CREATE TABLE `pelicula` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(100) NOT NULL,
    `duracion`INT(5) NOT NULL,
    `director` VARCHAR(400) NOT NULL,
    `anio` INT(5) NOT NULL,
    `fecha_lanzamiento` DATE NOT NULL,
    `puntuacion`INT(2) NOT NULL,
    `poster` VARCHAR(300) NOT NULL,
    `trama` VARCHAR(700) NOT NULL,

    PRIMARY KEY (`id`)
);

-----------------//--------------

USE `peliculas`;

CREATE TABLE `genero` (
    `id_genero` INT NOT NULL AUTO_INCREMENT,
    `nombre_genero` VARCHAR(30) NOT NULL,
    
    PRIMARY KEY (`id_genero`)
);

-----------------//--------------

USE `peliculas`;

CREATE TABLE `actor` (
    `id_actor` INT NOT NULL AUTO_INCREMENT,
    `nombre_actor` VARCHAR(70) NOT NULL,
    
    PRIMARY KEY (`id_actor`)
);

-----------------//--------------

USE `peliculas`;

CREATE TABLE `actor_pelicula` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `actor_id` INT NOT NULL,
    `pelicula_id` INT NOT NULL,
    
    PRIMARY KEY (`id`)
);

-----------------//--------------
