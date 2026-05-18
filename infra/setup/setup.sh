#!/bin/bash

set -e

echo "Atualizando pacotes..."
sudo apt update -y

echo "Instalando Git..."
if command -v git >/dev/null 2>&1; then
    echo "Git já está instalado, pulando"
else
    sudo apt install git -y
fi

echo "Instalando Docker..."
if command -v docker >/dev/null 2>&1; then
    echo "Docker já está instalado, pulando"
else
    sudo apt install docker.io -y
fi

echo "Instalando Docker Compose..."
if docker compose version >/dev/null 2>&1; then
    echo "Docker Compose já está instalado, pulando"
else
    sudo apt install docker-compose -y
fi

echo "Instalando Java..."
if command -v java >/dev/null 2>&1; then
    echo "Java já está instalado, pulando"
else
    sudo apt install openjdk-21-jdk -y
fi

BASE_DIR="/opt/conexao-academica"
REPO_URL="https://github.com/marlonzl7/conexao-academica.git"
REPO_DIR="$BASE_DIR/repo"

echo "Criando estrutura..."
sudo mkdir -p "$BASE_DIR"
sudo mkdir -p "$BASE_DIR/init-scripts"
sudo mkdir -p "$BASE_DIR/repo"
sudo mkdir -p "$BASE_DIR/bases"

sudo chown -R "$USER:$USER" "$BASE_DIR"

echo "Clonando repositório..."
if [ ! -d "$REPO_DIR/.git" ]; then
    git clone "$REPO_URL" "$REPO_DIR"
else
    echo "Repositório já existe, pulando clone"
fi

echo "Copiando docker-compose.yml..."
if [ ! -f "$BASE_DIR/docker-compose.yml" ]; then
    cp "$REPO_DIR/infra/docker-compose/docker-compose.yml" \
       "$BASE_DIR/docker-compose.yml"
else
    echo "docker-compose.yml já existe, pulando"
fi

echo "Copiando scripts de setup do banco de dados..."
if ! ls "$BASE_DIR/init-scripts/"*.sql >/dev/null 2>&1; then
    cp "$REPO_DIR/web-data-viz/src/database/01-script.sql" \
        "$BASE_DIR/init-scripts/01-script.sql"

    cp "$REPO_DIR/web-data-viz/src/database/02-create-users.sql" \
        "$BASE_DIR/init-scripts/02-create-users.sql"

    cp "$REPO_DIR/web-data-viz/src/database/03-iniciar-banco.sql" \
        "$BASE_DIR/init-scripts/03-iniciar-banco.sql"
else
    echo "Scripts já existem, pulando"
fi

echo "Copiando credenciais de exemplo..."
if [ ! -f "$BASE_DIR/.env" ]; then
    if [ -f "$REPO_DIR/infra/env/.env.exemplo" ]; then
        cp "$REPO_DIR/infra/env/.env.exemplo" "$BASE_DIR/.env"
    else
        echo ".env.exemplo não encontrado no repositório, criando template..."

        cat > "$BASE_DIR/.env" <<EOF
# BANCO DE DADOS
MYSQL_ROOT_PASSWORD=
DB_HOST=
DB_DATABASE=
DB_USER=
DB_PASSWORD=
DB_PORT=

# APP WEB
AMBIENTE_PROCESSO=
APP_PORT=
APP_HOST=

# EMAIL
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=

# APP ETL
BUCKET_NAME=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_SESSION_TOKEN=
AWS_REGION=
BASES_INSTITUICAO=
BASES_CURSO=
ETL_DB_URL=
ETL_DB_USER=
ETL_DB_PASSWORD=
EOF
    fi
else
    echo "Arquivo .env já existe, pulando"
fi

echo "Copiando arquivos de bases..."
if ! ls "$BASE_DIR/bases/"*.txt >/dev/null 2>&1; then
    if ls "$REPO_DIR/infra/bases/"*.txt >/dev/null 2>&1; then
        cp "$REPO_DIR/infra/bases/"*.txt "$BASE_DIR/bases/"
    else
        echo "Nenhum arquivo .txt encontrado em $REPO_DIR/infra/bases"
    fi
else
    echo "Arquivos de bases já existem, pulando"
fi

echo "Ajustando permissões..."
chmod 750 "$BASE_DIR"
chmod 600 "$BASE_DIR/.env"

echo ""
echo "Preencha as credenciais no arquivo: $BASE_DIR/.env"
echo "Setup concluído"
