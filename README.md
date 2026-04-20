# Gerenciador de Tarefas — Frontend
> Interface web para gerenciamento de tarefas em um to-do list, consumindo a API REST desenvolvida em Spring Boot.

---

## 🚀 Tecnologias Utilizadas

| Tecnologia | Descrição |
|---|---|
| ⚛️ **React** | Biblioteca principal para construção de interfaces |
| 🔺 **Next.js** | Framework React com roteamento e renderização |
| 🟦 **TypeScript** | Tipagem estática para maior segurança no código |
| 🎨 **Tailwind CSS** | Estilização utilitária |
| 🧩 **shadcn/ui + Radix UI** | Componentes de interface acessíveis e reutilizáveis |
| 🧪 **Jest + Testing Library** | Testes unitários e de componentes |
| 🔍 **ESLint + Prettier** | Linting e formatação de código |

---

## 🖥️ Funcionalidades

- 📋 Listagem de tarefas com filtro por status (`PENDENTE` / `CONCLUIDA`)
- ➕ Criação de novas tarefas
- ✏️ Edição de título, descrição e status de uma tarefa
- 🗑️ Remoção de tarefas
- ✅ Validação de formulários com feedback visual

---

## ⚙️ Como Rodar o Projeto

### Pré-requisitos

- Node.js 20+
- npm ou yarn
- API backend rodando em `http://localhost:8080`

### Instalação

```bash
# Clone o repositório
git clone https://github.com/gabicastrum/gerenciador-tarefas-app.git

# Acesse a pasta do projeto
cd gerenciador-tarefas-app

# Instale as dependências
npm install
```

### Scripts Disponíveis

```bash
# Inicia o servidor de desenvolvimento
npm run dev

# Executa os testes
npm test

Com o servidor de desenvolvimento rodando, acesse:

http://localhost:3000
```

---

## 🔌 Conexão com o Backend

Repositório do Backend: https://github.com/gabicastrum/gerenciador-tarefas-api

O frontend consome a API REST disponível em `http://localhost:8080`. Certifique-se de que o backend está rodando antes de iniciar a aplicação.

Consulte a documentação interativa da API em:

```
http://localhost:8080/swagger-ui/index.html
```

<p align="center">Feito com apoio de ☕ por <strong>👩‍💻 Gabriela de Castro Laurindo</strong></p>
