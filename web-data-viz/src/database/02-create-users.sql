CREATE DATABASE IF NOT EXISTS conexaoacademica;
USE conexaoacademica;

CREATE USER IF NOT EXISTS 'exemplo-web'@'%' IDENTIFIED BY '';
CREATE USER IF NOT EXISTS 'exemplo-etl'@'%' IDENTIFIED BY '';

GRANT SELECT, INSERT, UPDATE, DELETE ON conexaoacademica.* TO 'exemplo-web'@'%';

GRANT INSERT ON conexaoacademica.instituicao TO 'exemplo-etl'@'%';
GRANT INSERT ON conexaoacademica.curso TO 'exemplo-etl'@'%';
GRANT INSERT ON conexaoacademica.indicadores_curso TO 'exemplo-etl'@'%';
GRANT INSERT ON conexaoacademica.log TO 'exemplo-etl'@'%';

FLUSH PRIVILEGES;
