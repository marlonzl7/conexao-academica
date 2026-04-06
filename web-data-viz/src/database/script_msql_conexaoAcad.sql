CREATE DATABASE conexaoacademica;
USE conexaoacademica;

CREATE TABLE instituicao (
    id_instituicao INT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    uf CHAR(2) NOT NULL
);

CREATE TABLE curso (
    id_curso INT PRIMARY KEY,
    id_instituicao INT NOT NULL,
    nome VARCHAR(50) NOT NULL,
    modalidade VARCHAR(20) NOT NULL,
    CONSTRAINT fk_curso_instituicao FOREIGN KEY (id_instituicao) REFERENCES instituicao(id_instituicao)
);

CREATE TABLE indicadores_curso (
    id_curso INT NOT NULL,
    ano INT NOT NULL,
    quantidade_matriculas INT NOT NULL,
    quantidade_alunos_situacao_desvinculada INT NOT NULL,
    quantidade_alunos_situacao_trancada INT NOT NULL,
    CONSTRAINT pk_indicadores_curso PRIMARY KEY (id_curso, ano),
    CONSTRAINT fk_indicadores_curso_curso FOREIGN KEY (id_curso) REFERENCES curso(id_curso)
);

CREATE TABLE cargo (
    id_cargo INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL
);

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    id_instituicao INT,
    id_cargo INT NOT NULL,
    cpf CHAR(11) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(70) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    ativo TINYINT(1) NOT NULL,
    CONSTRAINT fk_usuario_instituicao FOREIGN KEY (id_instituicao) REFERENCES instituicao(id_instituicao),
    CONSTRAINT fk_usuario_cargo FOREIGN KEY (id_cargo) REFERENCES cargo(id_cargo)
);

CREATE TABLE coordenador_curso (
	id_usuario INT PRIMARY KEY,
    id_curso INT UNIQUE NOT NULL,
    
    CONSTRAINT fk_coordenador_curso_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario),
    CONSTRAINT fk_coordenador_curso_curso FOREIGN KEY (id_curso) REFERENCES curso (id_curso)
);

CREATE TABLE kpi (
    id_kpi INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL UNIQUE
);

CREATE TABLE regra (
    id_regra INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL,
    id_kpi INT NOT NULL,
    classificacao VARCHAR(20) NOT NULL,
    limite_inferior DECIMAL(5,2) NOT NULL,
    limite_superior DECIMAL(5,2) NOT NULL,
    CONSTRAINT fk_regra_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    CONSTRAINT fk_regra_kpi FOREIGN KEY (id_kpi) REFERENCES kpi(id_kpi),
    CONSTRAINT uq_usuario_kpi_classificacao UNIQUE (id_usuario, id_kpi, classificacao),
    CONSTRAINT chk_limite CHECK (limite_inferior < limite_superior)
);

CREATE TABLE mensagem (
	id_mensagem INT PRIMARY KEY AUTO_INCREMENT,
    mensagem VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    nome VARCHAR(80) NOT NULL
);

-- ----------------------------------------------------------------------------------------------

INSERT INTO instituicao (id_instituicao, nome, uf) VALUES
(1001, 'Universidade de São Paulo', 'SP'),
(1002, 'Universidade Federal de Minas Gerais', 'MG'),
(1003, 'Centro Universitário Tech Brasil', 'SP'),
(1004, 'Faculdade EAD Brasil', 'RJ');

INSERT INTO curso (id_curso, id_instituicao, nome, modalidade) VALUES

-- USP
(2001, 1001, 'Ciência da Computação', 'PRESENCIAL'),
(2002, 1001, 'Administração', 'PRESENCIAL'),

-- UFMG
(2003, 1002, 'Engenharia de Software', 'PRESENCIAL'),

-- EAD Brasil
(2004, 1004, 'Análise e Desenvolvimento de Sistemas', 'EAD'),
(2005, 1004, 'Gestão de TI', 'EAD'),
(2006, 1004, 'Pedagogia', 'EAD');

INSERT INTO indicadores_curso 
(id_curso, ano, quantidade_matriculas, quantidade_alunos_situacao_desvinculada, quantidade_alunos_situacao_trancada)
VALUES

-- Ciência da Computação (baixo risco)
(2001, 2022, 500, 50, 30),
(2001, 2023, 520, 55, 35),
(2001, 2024, 540, 60, 40),

-- Administração (médio risco)
(2002, 2022, 400, 80, 50),
(2002, 2023, 420, 90, 60),
(2002, 2024, 430, 95, 70),

-- Engenharia de Software (baixo risco)
(2003, 2022, 300, 30, 20),
(2003, 2023, 320, 35, 25),
(2003, 2024, 350, 40, 30),

-- ADS EAD (alto risco)
(2004, 2022, 600, 180, 120),
(2004, 2023, 650, 200, 150),
(2004, 2024, 700, 250, 180),

-- Gestão de TI EAD (alto risco)
(2005, 2022, 450, 150, 100),
(2005, 2023, 480, 170, 120),
(2005, 2024, 500, 200, 150),

-- Pedagogia EAD (médio/alto)
(2006, 2022, 550, 140, 90),
(2006, 2023, 580, 160, 100),
(2006, 2024, 600, 180, 120);

INSERT INTO regra 
(id_usuario, id_kpi, classificacao, limite_inferior, limite_superior)
VALUES

-- Coordenador ADS EAD (alto risco)
(5, 1, 'ALTO', 30.00, 100.00),
(5, 1, 'MEDIO', 15.00, 29.99),

-- Coordenador Pedagogia
(6, 1, 'ALTO', 25.00, 100.00),
(6, 1, 'MEDIO', 10.00, 24.99),

-- Coordenador CC (baixo risco)
(2, 1, 'ALTO', 20.00, 100.00),
	(2, 1, 'MEDIO', 10.00, 19.99);
    
-- INSERT CARGOS DO SISTEMA    
INSERT INTO cargo (id_cargo, nome) VALUES
	(1, 'Administrador - Conexao Academica');
	(2, 'Diretor - Instituicao'),
	(3, 'Coordenador - Instituicao'),
	(4, 'Administrador - Instituicao');
    
-- QUERIES DASH COORDENADOR
SELECT * FROM indicadores_curso;
desc indicadores_curso;
