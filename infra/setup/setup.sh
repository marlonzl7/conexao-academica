#!/bin/bash

set -e

BASE_DIR="/opt/conexao-academica"
REPO_URL="https://github.com/marlonzl7/conexao-academica.git"

echo "Criando estrutura"
sudo mkdir -p $BASE_DIR
sudo chown sys-admin:sys-admin $BASE_DIR

mkdir -p $BASE_DIR/repo
mkdir -p $BASE_DIR/env

echo "Clonando repositório"
if [ ! -d "$BASE_DIR/repo/.git" ]; then
	git clone $REPO_URL $BASE_DIR/repo
else
	echo "Repositório já existe, pulando clone"
fi

echo "Copiando credenciais de exemplo"
if [ ! -f "$BASE_DIR/env/.env" ]; then
	cp $BASE_DIR/repo/infra/env/.env.exemplo \
		$BASE_DIR/env/.env
else
	echo "Arquivo .env já existe, pulando"
fi

echo "Ajustando permissões"
chmod 750 $BASE_DIR
chmod 600 $BASE_DIR/env/prod.env

echo "Insira as credenciais corretas no arquivo .prod.env"

echo "Setup concluído"
