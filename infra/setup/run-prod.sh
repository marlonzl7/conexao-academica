#!/bin/bash

set -e

BASE_DIR="/opt/conexao-academica"
REPO_DIR="$BASE_DIR/repo/"
ENV_FILE="$BASE_DIR/env/prod.env"
NETWORK='conexao-network'

echo "Atualizando repositório"
cd $REPO_DIR
git pull

echo "Construindo imagens"
docker build -t mysql -f ./infra/docker/mysql/Dockerfile .
docker build -t etl-java -f ./infra/docker/etl-java/Dockerfile .
docker build -t web-data-viz -f ./infra/docker/web-data-viz/Dockerfile .

echo "Removendo containers antigos..."
docker stop web etl db 2>/dev/null || true
docker rm web etl db 2>/dev/null || true

echo "Criando rede docker..."
docker network create conexao-network 2>/dev/null || true

echo "Subindo banco de dados..."
docker run -d --name db --network $NETWORK --env-file $ENV_FILE -v mysql_data:/var/lib/mysql mysql

echo "Esprando banco subir..."
sleep 10

echo "Subindo Aplicação de ETL..."
docker run -d --name etl --network $NETWORK --env-file $ENV_FILE etl-java

echo "Subindo Aplicação WEB..."
docker run -d --name web --network $NETWORK --env-file $ENV_FILE -p 80:80 web-data-viz

echo "Deploy finalizado"
