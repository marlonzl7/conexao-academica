#!/bin/bash

set -e

BASE_DIR="/opt/conexao-academica"
REPO_URL="https://github.com/marlonzl7/conexao-academica.git"

echo "Criando estrutura"
mkdir -p $BASE_DIR/repo
mkdir -p $BASE_DIR/env

echo "Clonando repositório"
git clone $REPO_URL $BASE_DIR/repo

echo "Copiando credenciais de exemplo"
cp $BASE_DIR/repo/infra/env/prod.env.exemplo \
	$BASE_DIR/env/prod.env

echo "Adicionando permissão ao diretório do projeto"
chmod -R 750 $BASE_DIR

echo "Insira as credenciais corretas no arquivo .prod.env"

echo "Setup concluído"
