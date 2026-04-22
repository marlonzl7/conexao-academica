USE conexaoacademica;

CREATE USER 'example'@'localhost' IDENTIFIED BY 'example';

GRANT INSERT ON conexaoacademica.instituicao TO 'example'@'localhost';
GRANT INSERT ON conexaoacademica.curso TO 'example'@'localhost';
GRANT INSERT ON conexaoacademica.indicadores_curso TO 'example'@'localhost';

FLUSH PRIVILEGES;
