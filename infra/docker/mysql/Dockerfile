FROM mysql:8.0

COPY web-data-viz/src/database/script/script_mysql_conexaoAcad.sql \
     /docker-entrypoint-initdb.d/

COPY web-data-viz/src/database/script/create-users.sql \
     /docker-entrypoint-initdb.d/

EXPOSE 3306
