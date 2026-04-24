#!/bin/bash

set -e

echo "Iniciando setup..."

if [ "$EUID" -ne 0 ]; then
	echo "Execute como root"
	exit 1
fi

bash "./00-update.sh"
bash "./01-base.sh"

echo "Setup finalizado com sucesso"
