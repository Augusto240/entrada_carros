-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Tempo de geração: 14/11/2023 às 17:45
-- Versão do servidor: 8.0.33
-- Versão do PHP: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `dbentrada`
--
CREATE DATABASE IF NOT EXISTS `dbentrada` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE `dbentrada`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `aluno`
--

CREATE TABLE `aluno` (
  `matriculaAluno` bigint NOT NULL,
  `noAluno` varchar(100) NOT NULL,
  PRIMARY KEY (`matriculaAluno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Acionadores `aluno`
--
DELIMITER $$
CREATE TRIGGER `after_aluno_delete` AFTER DELETE ON `aluno` FOR EACH ROW BEGIN
        INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
        VALUES ('DELETE', 'root@localhost', NOW(), CONCAT('Registro deletado: matriculaAluno=', OLD.matriculaAluno, ' noAluno=', OLD.noAluno, '. Tabela aluno'));
      END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_aluno_insert` AFTER INSERT ON `aluno` FOR EACH ROW BEGIN
        INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
        VALUES ('INSERT', 'root@localhost', NOW(), CONCAT('Registro inserido: matriculaAluno=', NEW.matriculaAluno, ' noAluno=', NEW.noAluno, '. Tabela aluno'));
      END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_aluno_update` AFTER UPDATE ON `aluno` FOR EACH ROW BEGIN
        INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
        VALUES ('UPDATE', 'root@localhost', NOW(), CONCAT('Registro afetado: matriculaAluno=', OLD.matriculaAluno, ' noAluno=', OLD.noAluno, ' -> matriculaAluno=', NEW.matriculaAluno, ' noAluno=', NEW.noAluno, '. Tabela aluno'));
      END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `carro`
--

CREATE TABLE `carro` (
  `idCarro` int NOT NULL AUTO_INCREMENT,
  `marcaCarro` varchar(50) NOT NULL,
  `modeloCarro` varchar(80) NOT NULL,
  `anoCarro` int NOT NULL,
  `validaCnh` tinyint(1) NOT NULL,
  `codigoEtiqueta` varchar(50) NOT NULL,
  `validadeEtiqueta` datetime NOT NULL,
  `matriculaRel` bigint NOT NULL,
  `placaCarro` varchar(50) NOT NULL,
  PRIMARY KEY (`idCarro`),
  KEY `matriculaRel` (`matriculaRel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Acionadores `carro`
--
DELIMITER $$
CREATE TRIGGER `after_carro_delete` AFTER DELETE ON `carro` FOR EACH ROW BEGIN
        INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
        VALUES ('DELETE', 'root@localhost', NOW(), CONCAT('Registro deletado: idCarro=', OLD.idCarro, ', marcaCarro=', OLD.marcaCarro, ', modeloCarro=', OLD.modeloCarro, ', anoCarro=', OLD.anoCarro, ', validaCnh=', OLD.validaCnh, ', codigoEtiqueta=', OLD.codigoEtiqueta, ', validadeEtiqueta=', OLD.validadeEtiqueta, ', matriculaRel=', OLD.matriculaRel, '. Tabela carro'));
      END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_carro_insert` AFTER INSERT ON `carro` FOR EACH ROW BEGIN
        INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
        VALUES ('INSERT', 'root@localhost', NOW(), CONCAT('Registro inserido: idCarro=', NEW.idCarro, ', marcaCarro=', NEW.marcaCarro, ', modeloCarro=', NEW.modeloCarro, ', anoCarro=', NEW.anoCarro, ', validaCnh=', NEW.validaCnh, ', codigoEtiqueta=', NEW.codigoEtiqueta, ', validadeEtiqueta=', NEW.validadeEtiqueta, ', matriculaRel=', NEW.matriculaRel, '. Tabela carro'));
      END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `after_carro_update` AFTER UPDATE ON `carro` FOR EACH ROW BEGIN
        INSERT INTO logs (operacao, usuario, dataoperacao, detalhe)
        VALUES ('UPDATE', 'root@localhost', NOW(), CONCAT('Registro afetado: idCarro=', OLD.idCarro, ', marcaCarro=', OLD.marcaCarro, ', modeloCarro=', OLD.modeloCarro, ', anoCarro=', OLD.anoCarro, ', validaCnh=', OLD.validaCnh, ', codigoEtiqueta=', OLD.codigoEtiqueta, ', validadeEtiqueta=', OLD.validadeEtiqueta, ', matriculaRel=', OLD.matriculaRel, ' -> idCarro=', NEW.idCarro, ', marcaCarro=', NEW.marcaCarro, ', modeloCarro=', NEW.modeloCarro, ', anoCarro=', NEW.anoCarro, ', validaCnh=', NEW.validaCnh, ', codigoEtiqueta=', NEW.codigoEtiqueta, ', validadeEtiqueta=', NEW.validadeEtiqueta, ', matriculaRel=', NEW.matriculaRel, '. Tabela carro'));
      END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `login`
--

CREATE TABLE `login` (
  `idlogin` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(150) NOT NULL,
  `senha` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL UNIQUE,
  `role` varchar(150) NOT NULL,
  `resetToken` varchar(64) DEFAULT NULL,
  `resetTokenExpire` bigint DEFAULT NULL,
  PRIMARY KEY (`idlogin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `logs`
--

CREATE TABLE `logs` (
  `idlogs` int NOT NULL AUTO_INCREMENT,
  `operacao` varchar(50) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `dataoperacao` datetime NOT NULL,
  `detalhe` text NOT NULL,
  PRIMARY KEY (`idlogs`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `SequelizeMeta`
--

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura para view `vwalunocarro`
--
DROP VIEW IF EXISTS `vwalunocarro`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `vwalunocarro` AS
SELECT 
    `c`.`marcaCarro` AS `Marca`, 
    `c`.`modeloCarro` AS `Modelo`, 
    `c`.`anoCarro` AS `Ano`, 
    `a`.`noAluno` AS `Aluno`, 
    `a`.`matriculaAluno` AS `Matricula`, 
    `c`.`codigoEtiqueta` AS `codigoEtiqueta`, 
    `c`.`validaCnh` AS `validaCnh` 
FROM 
    `carro` `c` 
    INNER JOIN `aluno` `a` 
    ON `c`.`matriculaRel` = `a`.`matriculaAluno`;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tokens`
--

CREATE TABLE `tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `token` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `expiresAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `userId` (`userId`),
  CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `login` (`idlogin`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Eventos
--

DELIMITER $$
CREATE EVENT `delete_old_logs`
ON SCHEDULE EVERY 1 DAY
STARTS '2024-08-24 00:00:00'
DO
  DELETE FROM logs WHERE dataoperacao < NOW() - INTERVAL 30 DAY;
$$
DELIMITER ;

DELIMITER $$
CREATE EVENT `delete_expired_tokens`
ON SCHEDULE EVERY 1 DAY
STARTS '2024-08-24 00:00:00'
DO
  DELETE FROM tokens WHERE expiresAt < NOW();
$$
DELIMITER ;

COMMIT;

INSERT INTO login (usuario, senha, email, role) VALUES ('guto', 'guto', 'jose.aug18@outlook.com', 'admin');