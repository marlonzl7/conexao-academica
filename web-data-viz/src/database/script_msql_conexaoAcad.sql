CREATE DATABASE conexao_academica;
USE conexao_academica;

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
    id_instituicao INT NOT NULL,
    id_cargo INT NOT NULL,
    id_curso INT,
    cpf CHAR(11) NOT NULL UNIQUE,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(70) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    ativo TINYINT(1) NOT NULL DEFAULT 0,
    CONSTRAINT fk_usuario_instituicao FOREIGN KEY (id_instituicao) REFERENCES instituicao(id_instituicao),
    CONSTRAINT fk_usuario_cargo FOREIGN KEY (id_cargo) REFERENCES cargo(id_cargo),
    CONSTRAINT fk_usuario_curso FOREIGN KEY (id_curso) REFERENCES curso(id_curso)
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