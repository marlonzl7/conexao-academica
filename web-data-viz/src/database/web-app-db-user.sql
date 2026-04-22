USE conexaoacademica;

CREATE USER 'example'@'localhost' IDENTIFIED BY 'example';

GRANT SELECT, INSERT, UPDATE, DELETE ON conexaoacademica.* TO 'example'@'localhost';

FLUSH PRIVILEGES;
