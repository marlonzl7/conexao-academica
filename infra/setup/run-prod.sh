#!/bin/bash

set -e

BASE_DIR="/opt/conexao-academica"
REPO_DIR="$BASE_DIR/repo/"
ENV_FILE="$BASE_DIR/env/.env"
NETWORK='conexao-network'

echo "Atualizando repositório"
cd $REPO_DIR
git pull

echo "Construindo imagens"
sudo docker build -t mysql -f ./infra/docker/mysql/Dockerfile .
sudo docker build -t etl-java -f ./infra/docker/etl-java/Dockerfile .
sudo docker build -t web-data-viz -f ./infra/docker/web-data-viz/Dockerfile .

echo "Removendo containers antigos..."
sudo docker stop web etl db 2>/dev/null || true
sudo docker rm web etl db 2>/dev/null || true

echo "Criando rede docker..."
sudo docker network create conexao-network 2>/dev/null || true

echo "Subindo banco de dados..."
sudo docker run -d --name db -p 3306:3306 --network $NETWORK --env-file $ENV_FILE -v mysql_data:/var/lib/mysql mysql

echo "Esprando banco subir..."
sleep 10

echo "Subindo Aplicação de ETL..."
sudo docker run -d --name etl -p 5000:5000 --network $NETWORK --env-file $ENV_FILE etl-java

echo "Subindo Aplicação WEB..."
sudo docker run -d --name web --network $NETWORK --env-file $ENV_FILE -p 80:80 web-data-viz

echo "Deploy finalizado"
