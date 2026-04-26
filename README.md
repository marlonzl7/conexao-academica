# 📊 Sistema de Análise de Evasão no Ensino Superior (EAD)

Este projeto institucional tem como objetivo monitorar, processar e visualizar dados críticos sobre as taxas de evasão em cursos de graduação a distância. A solução combina uma pipeline de dados robusta com uma interface de gestão para auxiliar na retenção de alunos.

---

## 🚀 Tecnologias e Ferramentas

O ecossistema do projeto foi construído utilizando uma stack que prioriza performance e escalabilidade:

### **Frontend & Interface**
* **HTML5 / CSS3:** Estrutura e estilização moderna com foco em UX.
* **JavaScript (ES6+):** Manipulação dinâmica do DOM e consumo de APIs.

### **Backend & API**
* **Node.js:** Ambiente de execução para o servidor.
* **Express:** Framework para criação de rotas e gerenciamento de requisições HTTP.

### **Dados & Persistência**
* **MySQL:** Banco de dados relacional para armazenamento de registros acadêmicos.
* **Java ETL:** Aplicação dedicada para Extração, Transformação e Carga (ETL) de grandes volumes de dados brutos.

### **Infraestrutura**
* **AWS (Amazon Web Services):** Hospedagem e gerenciamento de recursos em nuvem.

---

## 🛠️ Funcionalidades

* **Processamento Automatizado:** Pipeline Java para tratar dados de planilhas e sistemas acadêmicos.
* **Dashboard de Gestão:** Gráficos interativos mostrando a evolução da evasão por semestre.
* **Relatórios de Risco:** Identificação precoce de alunos com alta probabilidade de abandono.

---

## ⚙️ Como Executar o Projeto

### Ambiente de desenvolvimento (Local)

### Pré-requisitos
* Node.js instalado (v16+)
* MySQL Server configurado
* JDK 17 ou superior

### Passos
1. **Clone o Repositório**
   ```bash
   git clone [https://github.com/marlonzl7/conexao-academica.git)
   ```

---

### Deploy em Servidor Linux (Ubuntu)

#### Pré-requisitos

* Servidor Linux (Ubuntu)
* Acesso root ou sudo

---

### 1. Criar usuário administrador

```bash
sudo adduser admin
sudo usermod -aG sudo admin
```

---

### 2. Instalar dependências

```bash
sudo apt update
sudo apt install docker.io git -y
```

---

### 3. Iniciar Docker

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

---

### 4. Acessar como admin

```bash
su - admin
```

---

### 5. Clonar o projeto

```bash
git clone https://github.com/marlonzl7/conexao-academica.git
cd conexao-academica/infra/setup
```

---

### 6. Executar setup inicial

```bash
chmod +x setup.sh
./setup.sh
```

---

### 7. Configurar variáveis de ambiente

```bash
nano /opt/conexao-academica/env/prod.env
```

Preencha com suas credenciais de banco, email e demais configurações.

---

### 8. Executar deploy

```bash
cd /opt/conexao-academica/repo/infra/setup
chmod +x run-prod.sh
./run-prod.sh
```

---
