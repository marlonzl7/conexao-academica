DROP DATABASE conexaoacademica;
CREATE DATABASE conexaoacademica;

USE conexaoacademica;

-- TABELAS

CREATE TABLE cargo (
    id_cargo INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(90) NOT NULL UNIQUE
);

CREATE TABLE instituicao (
    id_instituicao INT PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    uf CHAR(2) NOT NULL
);

CREATE TABLE curso (
    id_curso INT PRIMARY KEY,
    id_instituicao INT NOT NULL,
    nome VARCHAR(200) NOT NULL,
    modalidade VARCHAR(20) NOT NULL,
    CONSTRAINT fk_curso_instituicao FOREIGN KEY (id_instituicao) REFERENCES instituicao(id_instituicao),
    CONSTRAINT chk_modalidade CHECK (modalidade IN ('PRESENCIAL', 'EAD'))
);

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    id_cargo INT NOT NULL,
    id_instituicao INT,
    id_curso INT UNIQUE,
    id_usuario_criador INT,
    cpf CHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    ativo TINYINT NOT NULL,
    CONSTRAINT chk_usuario_autorizado CHECK ((id_instituicao IS NOT NULL AND id_curso IS NULL) OR (id_curso IS NOT NULL AND id_instituicao IS NULL)),
    CONSTRAINT fk_usuario_cargo FOREIGN KEY (id_cargo) REFERENCES cargo(id_cargo),
    CONSTRAINT fK_usuario_instituicao FOREIGN KEY (id_instituicao) REFERENCES instituicao(id_instituicao),
    CONSTRAINT fk_usuario_curso FOREIGN KEY (id_curso) REFERENCES curso(id_curso),
    CONSTRAINT fk_usuario_usuariocriador FOREIGN KEY (id_usuario_criador) REFERENCES usuario(id_usuario)
);

CREATE TABLE kpi (
    id_kpi INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(45) NOT NULL UNIQUE
);

CREATE TABLE regra (
    id_regra INT PRIMARY KEY AUTO_INCREMENT,
    id_instituicao INT NOT NULL,
    id_kpi INT NOT NULL,
    classificacao VARCHAR(20) NOT NULL,
    cor_hexadecimal CHAR(6),
    limite_inferior DECIMAL(5,2) NOT NULL,
    limite_superior DECIMAL(5,2) NOT NULL,
    CONSTRAINT fk_regra_instituicao FOREIGN KEY (id_instituicao) REFERENCES instituicao(id_instituicao),
    CONSTRAINT fk_regra_kpi FOREIGN KEY (id_kpi) REFERENCES kpi(id_kpi),
    CONSTRAINT chk_limite CHECK (limite_inferior < limite_superior)
);

CREATE TABLE indicadores_curso (
    id_curso INT,
    ano INT,
    quantidade_matriculas INT NOT NULL,
    quantidade_alunos_situacao_desvinculada INT NOT NULL,
    quantidade_alunos_situacao_trancada INT NOT NULL,
    CONSTRAINT pk_indicadores_curso PRIMARY KEY (id_curso, ano),
    CONSTRAINT fk_indicadorescurso_curso FOREIGN KEY (id_curso) REFERENCES curso(id_curso)
);

CREATE TABLE mensagem (
    id_mensagem INT PRIMARY KEY AUTO_INCREMENT,
    mensagem TEXT NOT NULL,
    email VARCHAR(100) NOT NULL,
    nome VARCHAR(100) NOT NULL
);

CREATE TABLE log (
    id_log INT PRIMARY KEY AUTO_INCREMENT,
    mensagem TEXT NOT NULL,
    tipo VARCHAR(10) NOT NULL,
    modulo VARCHAR(100) NOT NULL,
    data_hora DATETIME NOT NULL,
    CONSTRAINT chk_tipo CHECK (tipo IN ('DEBUG', 'INFO', 'WARN', 'ERROR'))
);

-- VIEWS

CREATE VIEW `vw_info_user` AS
	SELECT u.id_usuario,
    u.nome AS nome_usuario,
    i.nome AS nome_instituicao,
    cr.nome AS nome_curso,
	u.cpf AS cpf,
    u.email AS email,
    u.ativo AS ativo,
    ca.nome AS nome_cargo
FROM usuario u
	INNER JOIN cargo ca
		ON ca.id_cargo = u.id_cargo
	INNER JOIN instituicao i
		ON i.id_instituicao = u.id_instituicao
    INNER JOIN curso cr
		ON cr.id_instituicao = i.id_instituicao;

CREATE VIEW `vw_indic_geral` AS
	SELECT i.id_instituicao,
    i.nome AS nome_instituicao,
    ic.ano AS ano_emissao,
    SUM(ic.quantidade_matriculas) AS total_matriculas,
    SUM(ic.quantidade_alunos_situacao_desvinculada) AS total_desvinculados,
    SUM(ic.quantidade_alunos_situacao_trancada) AS total_trancados,
    ROUND(SUM(ic.quantidade_alunos_situacao_desvinculada) * 100.0 / NULLIF(SUM(ic.quantidade_matriculas), 0), 1) AS taxa_evasao,
     -- Total de alunos desvinculados da modalidade presencial
	SUM(CASE
			WHEN c.modalidade = 'PRESENCIAL'
            THEN ic.quantidade_alunos_situacao_desvinculada
            ELSE 0
		END) AS total_presencial,
        
	-- Total de alunos desvinculados da modalidade EaD
	SUM(CASE
			WHEN c.modalidade = 'EAD'
            THEN ic.quantidade_alunos_situacao_desvinculada
            ELSE 0
		END) AS total_ead,
        
	-- Percentual de evasão de modalidade presencial da instituição
	ROUND((SUM(CASE
					WHEN c.modalidade = 'PRESENCIAL'
                    THEN ic.quantidade_alunos_situacao_desvinculada
                    ELSE 0
				END) * 100.0 / NULLIF(SUM(ic.quantidade_alunos_situacao_desvinculada), 0)), 1) AS evadidos_presencial,
                
	-- Percentual de evasão de modalidade EaD da instituição
	ROUND((SUM(CASE
					WHEN c.modalidade = 'EAD'
                    THEN ic.quantidade_alunos_situacao_desvinculada
                    ELSE 0
				END) * 100.0 / NULLIF(SUM(ic.quantidade_alunos_situacao_desvinculada), 0)), 1) AS evadidos_ead
	-- IMPORTANTE: Use os dois percentuais para criar a KPI de diferença de evasão presencial e EaD!!!
    FROM indicadores_curso ic
		INNER JOIN curso c
			ON ic.id_curso = c.id_curso
		INNER JOIN instituicao i
			ON c.id_instituicao = i.id_instituicao
	GROUP BY 
		i.id_instituicao, i.nome, ic.ano;

CREATE VIEW `vw_indic_curso` AS
	SELECT i.id_instituicao,
    c.id_curso,
    i.nome AS nome_instituicao,
    c.nome AS nome_curso,
    ic.ano AS ano_emissao,
    ic.quantidade_matriculas AS quantidade_matriculas,
    ic.quantidade_alunos_situacao_desvinculada AS quantidades_desvinculados,
    ic.quantidade_alunos_situacao_trancada AS quantidade_trancados,
    ROUND(ic.quantidade_alunos_situacao_desvinculada * 100.0 / NULLIF(ic.quantidade_matriculas, 0), 1) AS taxa_evasao,
        ic.quantidade_matriculas + ic.quantidade_alunos_situacao_desvinculada + ic.quantidade_alunos_situacao_trancada AS total_alunos,
        
	-- Percentual de alunos ativos
	ROUND((ic.quantidade_matriculas - (ic.quantidade_alunos_situacao_desvinculada + ic.quantidade_alunos_situacao_trancada)) * 100.0 / NULLIF((ic.quantidade_matriculas), 0), 1) AS percentual_matriculados,
    
	-- Percentual de evasão de alunos desvinculados
	ROUND(ic.quantidade_alunos_situacao_desvinculada * 100.0 / NULLIF((ic.quantidade_matriculas), 0), 1) AS percentual_evadidos,
	
    -- Percentual de alunos de situação trancada
    ROUND(ic.quantidade_alunos_situacao_trancada * 100.0 / NULLIF((ic.quantidade_matriculas), 0), 1) AS percentual_trancados
    FROM indicadores_curso ic
		INNER JOIN curso c
			ON ic.id_curso = c.id_curso
		INNER JOIN instituicao i
			ON c.id_instituicao = i.id_instituicao;

CREATE VIEW `vw_top_3_evasao` AS
	WITH ranked AS (
		SELECT i.id_instituicao,
        i.nome AS nome_instituicao,
        c.nome AS nome_curso,
        ic.ano AS ano_emissao,
        SUM(ic.quantidade_matriculas) AS total_matriculas,
        SUM(ic.quantidade_alunos_situacao_desvinculada) AS total_evadidos,
        
        -- Ranking de cursos baseado em instituição/ano
        DENSE_RANK() OVER (
			PARTITION BY i.id_instituicao, ic.ano
            ORDER BY
				SUM(ic.quantidade_alunos_situacao_desvinculada) * 100.0
                / NULLIF(SUM(ic.quantidade_matriculas), 0) DESC) AS ranking
                
		FROM indicadores_curso ic
			INNER JOIN curso c
				ON ic.id_curso = c.id_curso
			INNER JOIN instituicao i
				ON c.id_instituicao = i.id_instituicao
			GROUP BY 
				i.id_instituicao, i.nome, c.nome, ic.ano)
		SELECT * FROM ranked
		WHERE ranking <= 3
        ORDER BY 
			id_instituicao,
            ano_emissao,
            ranking;