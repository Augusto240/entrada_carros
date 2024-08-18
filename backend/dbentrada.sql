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
  `noAluno` varchar(100) NOT NULL
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
  `idCarro` int NOT NULL,
  `marcaCarro` varchar(50) NOT NULL,
  `modeloCarro` varchar(80) NOT NULL,
  `anoCarro` int NOT NULL,
  `validaCnh` tinyint(1) NOT NULL,
  `codigoEtiqueta` varchar(50) NOT NULL,
  `validadeEtiqueta` datetime NOT NULL,
  `matriculaRel` bigint NOT NULL,
  `placaCarro` varchar(50) NOT NULL
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
  `idlogin` int NOT NULL,
  `usuario` varchar(150) NOT NULL,
  `senha` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `logs`
--

CREATE TABLE `logs` (
  `idlogs` int NOT NULL,
  `operacao` varchar(50) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `dataoperacao` datetime NOT NULL,
  `detalhe` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `SequelizeMeta`
--

CREATE TABLE `SequelizeMeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura stand-in para view `vwalunocarro`
-- (Veja abaixo para a visão atual)
--
CREATE TABLE `vwalunocarro` (
`Aluno` varchar(100)
,`Ano` int
,`CNHvalida` tinyint(1)
,`codigoEtiqueta` varchar(50)
,`Marca` varchar(50)
,`Matricula` bigint
,`Modelo` varchar(80)
,`Placa` varchar(50)
,`validadeEtiqueta` datetime
);

-- --------------------------------------------------------

--
-- Estrutura para view `vwalunocarro`
--
DROP TABLE IF EXISTS `vwalunocarro`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `vwalunocarro`  AS SELECT `c`.`marcaCarro` AS `Marca`, `c`.`modeloCarro` AS `Modelo`, `c`.`anoCarro` AS `Ano`, `a`.`noAluno` AS `Aluno`, `a`.`matriculaAluno` AS `Matricula`, `c`.`codigoEtiqueta` AS `codigoEtiqueta`, `c`.`validaCnh` AS `CNHvalida`, `c`.`placaCarro` AS `Placa`, `c`.`validadeEtiqueta` AS `validadeEtiqueta` FROM (`carro` `c` join `aluno` `a` on((`a`.`matriculaAluno` = `c`.`matriculaRel`))) ;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `aluno`
--
ALTER TABLE `aluno`
  ADD PRIMARY KEY (`matriculaAluno`);

--
-- Índices de tabela `carro`
--
ALTER TABLE `carro`
  ADD PRIMARY KEY (`idCarro`),
  ADD KEY `matriculaRel` (`matriculaRel`);

--
-- Índices de tabela `login`
--
ALTER TABLE `login`
  ADD PRIMARY KEY (`idlogin`);

--
-- Índices de tabela `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`idlogs`);

--
-- Índices de tabela `SequelizeMeta`
--
ALTER TABLE `SequelizeMeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `carro`
--
ALTER TABLE `carro`
  MODIFY `idCarro` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `login`
--
ALTER TABLE `login`
  MODIFY `idlogin` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `logs`
--
ALTER TABLE `logs`
  MODIFY `idlogs` int NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `carro`
--
ALTER TABLE `carro`
  ADD CONSTRAINT `carro_ibfk_1` FOREIGN KEY (`matriculaRel`) REFERENCES `aluno` (`matriculaAluno`) ON DELETE CASCADE ON UPDATE CASCADE;

DELIMITER $$
--
-- Eventos
--
CREATE DEFINER=`root`@`%` EVENT `delete_old_logs` ON SCHEDULE EVERY 1 DAY STARTS '2023-11-08 16:36:20' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM logs WHERE dataoperacao < NOW() - INTERVAL 30 DAY$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- Verifique se a tabela `users` já foi criada e está com a seguinte estrutura:

CREATE TABLE IF NOT EXISTS `users` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabela `tokens` que faz referência à tabela `users`

CREATE TABLE `tokens` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `userId` INT NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- A coluna 'expiresAt' será usada para armazenar a data de expiração do token.
    `expiresAt` TIMESTAMP AS (`createdAt` + INTERVAL 1 HOUR) STORED,
    CONSTRAINT `fk_user` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Opcional: criar um evento para limpar tokens expirados automaticamente
CREATE EVENT delete_expired_tokens
ON SCHEDULE EVERY 1 HOUR
DO
    DELETE FROM tokens WHERE expiresAt < NOW();

ALTER TABLE users
ADD COLUMN resetToken VARCHAR(255),
ADD COLUMN resetTokenExpire DATETIME;
