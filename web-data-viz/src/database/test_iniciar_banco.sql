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
	(1, 'administrador'),
	(2, 'diretor'),
	(3, 'coordenador'),
	(4, 'administrador_instituicao');
    
-- QUERIES DASH COORDENADOR
SELECT * FROM indicadores_curso;
desc indicadores_curso;