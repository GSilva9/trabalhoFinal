-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`socio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`socio` (
  `id_socio` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(150) NOT NULL,
  `cpf` VARCHAR(11) NOT NULL,
  `senha` VARCHAR(60) NOT NULL,
  `endereco_logradouro` VARCHAR(200) NOT NULL,
  `endereco_numero` VARCHAR(8) NOT NULL,
  `endereco_cep` VARCHAR(10) NOT NULL,
  `email` VARCHAR(45) NOT NULL UNIQUE,
  `cidade` VARCHAR(45) NOT NULL,
  `uf` VARCHAR(2) NOT NULL,
  `telefone` VARCHAR(45) NOT NULL,
  `administrador` BOOLEAN,
  PRIMARY KEY (`id_socio`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`plano`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`plano` (
  `id_plano` INT NOT NULL,
  `valor` DECIMAL(10,2) NOT NULL,
  `descricao` VARCHAR(100) NOT NULL,
  `nome` VARCHAR(50) NOT NULL,
  `url_plano` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id_plano`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`pagamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`pagamento` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `id_socio` INT NOT NULL,
  `id_plano` INT NOT NULL,
  `data_pagamento` VARCHAR(6) NOT NULL,
  `status_pagamento` BOOLEAN NOT NULL,
  PRIMARY KEY (`data_pagamento`, `id_socio`, `id_plano`),
  CONSTRAINT `fk_socio_has_plano_socio`
    FOREIGN KEY (`id_socio`)
    REFERENCES `mydb`.`socio` (`id_socio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_socio_has_plano_plano1`
    FOREIGN KEY (`id_plano`)
    REFERENCES `mydb`.`plano` (`id_plano`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
