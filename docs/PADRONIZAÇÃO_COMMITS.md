# Padrão de Commits

Este projeto utiliza um padrão baseado no Conventional Commits para manter o histórico organizado e facilitar a leitura das alterações.

## Formato do commit

tipo: descrição

Exemplo:
```
feat: adicionar suporte a múltiplos usuários
```

---

## Tipos de commit

### feat
Nova funcionalidade adicionada ao sistema.

Exemplo:
```
feat: adicionar autenticação com JWT
```

### fix
Correção de bug.

Exemplo:
```
fix: corrigir erro no cálculo da média
```

### docs
Alterações na documentação.

Exemplo:
```
docs: atualizar instruções de instalação
```

### style
Mudanças apenas visuais ou de formatação (não altera lógica).

Exemplo:
```
style: ajustar indentação no controller
```

### refactor
Refatoração de código sem alterar comportamento.

Exemplo:
```
refactor: simplificar validação de usuário
```

### test
Adição ou modificação de testes.

Exemplo:
```
test: adicionar testes para UserService
```

### chore
Tarefas de manutenção.

Exemplo:
```
chore: atualizar dependências do projeto
```

---

## Boas práticas

- Use descrição curta e objetiva
- Escreva no imperativo (ex: "adicionar", "corrigir", "remover")
- Evite commits genéricos como:
  - "update"
  - "mudanças"
  - "ajustes"

---

## Exemplo de commit completo

```bash
git commit -m "feat: implementar endpoint de cadastro de usuário"

