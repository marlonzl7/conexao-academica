#!/bin/bash

set -e

echo "Iniciando instalação das ferramentas básicas..."

apt install openjdk-21-jdk -y \
	maven \
	mysql-server \
	npm \
	nodejs \
	neovim \
	tree \
	git \
	curl

echo "Ferramentas básicas instaladas"
