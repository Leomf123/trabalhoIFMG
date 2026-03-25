# Trabalho IFMG - Marketplace

## Funcionalidades

- **Sistema de Autenticação** 
  - Cadastro de novos usuários/lojistas
  - Login com validação de credenciais
  - Logout e gerenciamento de sessão

- **Gerenciamento de Perfil** 
  - Visualização e edição de dados da loja
  - Campos: nome, nome da loja, descrição e e-mail

- **Gerenciamento de Produtos** 
  - Cadastrar novos produtos
  - Listar produtos da loja
  - Editar informações de produtos existentes
  - Excluir produtos

- **Segurança** 
  - Proteção CSRF em todos os formulários
  - Senhas criptografadas com bcrypt
  - Validação de dados nos modelos
  - Sessões seguras

## Tecnologias Utilizadas

- **Backend:**
  - Node.js
  - Express.js
  - SQLite3
  - bcryptjs (hash de senhas)
  - express-session (gerenciamento de sessões)
  - connect-flash (mensagens temporárias)
  - csrf-sync (proteção CSRF)

- **Frontend:**
  - EJS (templates)
  - Bootstrap 5 (estilização)
  - Bootstrap Icons

## Pré-requisitos

- Node.js (versão 12 ou superior)
- npm (gerenciador de pacotes do Node)

## 🚀 Como Rodar o Projeto

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/nome-do-repositorio.git
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```env
DB_PATH=./database/database.db
```

### 4. Execute o servidor
```
npm start
ou em modo desenvolvimento
npm run dev
```

### 5. Acesse a aplicação

Abra seu navegador e acesse: http://localhost:3000

## Estrutura do Projeto
```
├── database/           # Banco de dados SQLite
├── models/             # Modelos da aplicação (Usuarios, Produtos)
├── controllers/        # Controladores das rotas
├── views/              # Templates EJS
│   ├── includes/       # Partials reutilizáveis (header, nav, footer)
│   └── *.ejs          # Páginas principais
├── public/            # Arquivos estáticos (CSS, JS, imagens)
├── routes/            # Definição de rotas
├── middlewares/       # Middlewares personalizados
├── app.js             # Arquivo principal da aplicação
└── package.json       # Dependências e scripts
```
## Segurança
Proteção CSRF em todos os formulários

Senhas com hash (bcrypt)

Validação de dados no backend

Sessões seguras

Proteção contra injeção SQL (parâmetros preparados)

## Licença
Este projeto foi desenvolvido por alunos e alunas do curso BackEnd em Javascript do programa [Bolsa Futuro Digital](https://www.capacita.cepedi.org.br/) para fins educacionais.