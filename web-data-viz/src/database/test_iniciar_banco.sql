USE conexaoacademica;

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
    
-- INSERT CARGOS DO SISTEMA    
INSERT INTO cargo (nome) VALUES
	('administrador'),
	('diretor'),
	('coordenador'),
	('administrador_instituicao');
    
-- INSERT DAS KPIs
INSERT INTO kpi (nome) VALUES
    ('taxa_evasao_instituicao'),
    ('tendencia_evasao_instituicao'),
    ('taxa_evasao_curso'),
    ('risco_evasao_curso'),
    ('tendencia_evasao_curso'),
    ('total_alunos_matriculados');

INSERT INTO regra (id_instituicao, id_kpi, classificacao, descricao, cor_hexadecimal, limite_inferior, limite_superior) VALUES
-- Regras para a USP (id_instituicao: 1001) - KPI: taxa_evasao_curso (id_kpi: 3)
    (1001, 3, 'ALTO', 'Taxa de evasão crítica para o curso', 'FF0000', 30.00, 100.00),
    (1001, 3, 'MEDIO', 'Taxa de evasão em estado de alerta', 'FFA500', 15.00, 29.99),

-- Regras para a UFMG (id_instituicao: 1002) - KPI: risco_evasao_curso (id_kpi: 4)
    (1002, 4, 'ALTO', 'Risco de evasão calculado muito alto', 'FF0000', 25.00, 100.00),
    (1002, 4, 'MEDIO', 'Risco de evasão calculado moderado', 'FFA500', 10.00, 24.99),

-- Regras para a Faculdade EAD Brasil (id_instituicao: 1004) - KPI: taxa_evasao_curso (id_kpi: 3)
    (1004, 3, 'ALTO', 'Evasão severa no ambiente virtual', 'FF0000', 20.00, 100.00),
    (1004, 3, 'MEDIO', 'Evasão moderada no ambiente virtual', 'FFA500', 10.00, 19.99);
    
-- QUERIES DASH COORDENADOR
SELECT * FROM indicadores_curso;
desc indicadores_curso;

-- UTILITÁRIOS
SHOW PROCESSLIST;
