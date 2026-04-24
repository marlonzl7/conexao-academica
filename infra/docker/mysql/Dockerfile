FROM mysql:8.0

COPY web-data-viz/database/script/script_mysql_conexaoAcad.sql \
     /docker-entrypoint-initdb.d/

COPY web-data-viz/database/script/create-users.sql \
     /docker-entrypoint-initdb.d/

EXPOSE 3306
