#!/bin/bash

set -e

echo "Atualizando pacotes do sistema..."

apt update && apt upgrade -y

echo "Pacotes atualizados"
