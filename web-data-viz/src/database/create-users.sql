USE conexaoacademica;

CREATE USER 'exemplo-web'@'localhost' IDENTIFIED BY '';

GRANT SELECT, INSERT, UPDATE, DELETE ON conexaoacademica.* TO 'exemplo-web'@'localhost';

CREATE USER 'exemplo-etl'@'localhost' IDENTIFIED BY '';

GRANT INSERT ON conexaoacademica.instituicao TO 'exemplo-etl'@'localhost'
GRANT INSERT ON conexaoacademica.curso TO 'exemplo-etl'@'localhost'
GRANT INSERT ON conexaoacademica.indicadores_curso TO 'exemplo-etl'@'localhost'

FLUSH PRIVILEGES
