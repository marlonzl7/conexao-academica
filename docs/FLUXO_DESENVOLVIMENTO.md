# Fluxo de Branches

Este projeto utiliza o seguinte fluxo de desenvolvimento:

Funcionalidade → dev → main

---

# Estrutura das branches

## main
- Contém apenas código estável
- Sempre pronta para produção
- Não se desenvolve diretamente nela

## dev
- Branch de integração
- Recebe todas as funcionalidades concluídas
- Serve como ambiente de testes antes de ir para main

---

# Tipos de branches

As branches devem seguir o mesmo padrão dos commits:

- feat/<nome> → Nova funcionalidade
- fix/<nome> → Correção de bug
- refactor/<nome> → Refatoração sem alterar comportamento
- docs/<nome> → Alteração na documentação
- test/<nome> → Adição ou modificação de testes
- chore/<nome> → Tarefas de manutenção

Exemplos:
```
feat/autenticacao-jwt
fix/correcao-calculo-media
refactor/organizar-user-service
```

---

# Fluxo de desenvolvimento passo a passo

## Atualizar a branch dev

```bash
git switch dev
git pull origin dev
```

---

## Criar uma nova branch de funcionalidade

git switch -c feature/nome-da-feature

Exemplo:
```bash
git switch -c feature/autenticacao-jwt
```

---

## Desenvolver normalmente

Faça commits seguindo o padrão definido em [Guia de Padrão de Commits](./PADRONIZAÇÃO_COMMITS.md).

Exemplo:
```bash
git commit -m "feat: implementar login com sessão"
```

---

## Enviar a branch para o repositório remoto

```bash
git push origin feature/nome-da-feature
```

---

## Criar Pull Request para dev

- Abrir PR da feature para dev no GitHub
- Aguardar revisão de todos
- Realizar ajustes se necessário
- Após aprovação, realizar merge

---

## Integração para main

Quando a dev estiver estável:

- Criar Pull Request de dev para main
- Revisar
- Realizar merge

---

# Regras importantes

- Nunca desenvolver direto na main
- Nunca fazer commit direto na dev sem ser via Pull Request
- Sempre atualizar a dev antes de criar uma nova branch
- Sempre usar o padrão de commits

---

# Resumo visual do fluxo

feature/nome-da-feature → dev → main

