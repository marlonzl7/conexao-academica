FROM mysql:8.0

COPY web-data-viz/src/database/01-script.sql \
     /docker-entrypoint-initdb.d/

COPY web-data-viz/src/database/02-create-users.sql \
     /docker-entrypoint-initdb.d/

COPY web-data-viz/src/database/03-iniciar-banco.sql \
     /docker-entrypoint-initdb.d/

EXPOSE 3306
