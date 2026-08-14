<div align="center">

# 🚀 CRUD de Usuários

Sistema completo de gerenciamento de usuários desenvolvido com **Java, Spring Boot, PostgreSQL, HTML, CSS e JavaScript**.

Projeto desenvolvido como atividade prática da disciplina de Residência de Software III.

<br>

<img src="https://img.shields.io/badge/Java-25-red?style=for-the-badge&logo=openjdk">
<img src="https://img.shields.io/badge/Spring_Boot-4.1-success?style=for-the-badge&logo=springboot">
<img src="https://img.shields.io/badge/PostgreSQL-18-blue?style=for-the-badge&logo=postgresql">
<img src="https://img.shields.io/badge/HTML5-orange?style=for-the-badge&logo=html5">
<img src="https://img.shields.io/badge/CSS3-blue?style=for-the-badge&logo=css3">
<img src="https://img.shields.io/badge/JavaScript-yellow?style=for-the-badge&logo=javascript">

</div>

---

# 📖 Sobre

Este projeto consiste em um sistema completo de gerenciamento de usuários, com operações de **CRUD (Create, Read, Update e Delete)**, autenticação, recuperação de senha e separação de acesso por perfil.

A aplicação utiliza uma arquitetura em camadas, separando:

- Controller
- Service
- Repository
- Entity
- Exception
- Banco de dados
- Front-end

Toda a comunicação entre a interface e o banco de dados ocorre por meio de uma **API REST**, desenvolvida com Spring Boot.

O sistema possui dois perfis de acesso:

- **ADMIN:** acesso ao painel administrativo e ao gerenciamento de usuários.
- **USER:** acesso à área do usuário e ao jogo Pong.

---

# ✨ Funcionalidades

## 🔐 Autenticação

- ✅ Login de usuários
- ✅ Cadastro de novas contas
- ✅ Recuperação e redefinição de senha
- ✅ Redirecionamento de acordo com o perfil
- ✅ Perfis `ADMIN` e `USER`
- ✅ Criação automática do administrador inicial
- ✅ Controle da sessão do usuário no front-end
- ✅ Logout com retorno para a tela de login

## 👥 Gerenciamento de usuários

- ✅ Cadastro de usuários
- ✅ Listagem de usuários ativos
- ✅ Consulta de usuário por ID
- ✅ Atualização de usuários
- ✅ Exclusão lógica de usuários
- ✅ Modal de confirmação antes da exclusão
- ✅ Registro da data e hora da última ação
- ✅ Data de cadastro automática
- ✅ Perfil padrão `USER`
- ✅ Status ativo definido automaticamente

## ✔️ Validações

- ✅ Validação de campos obrigatórios
- ✅ Validação do formato do e-mail
- ✅ Validação da unicidade do e-mail
- ✅ Validação da unicidade do CPF
- ✅ Validação da unicidade do telefone
- ✅ Normalização de CPF e telefone
- ✅ Normalização do e-mail
- ✅ Tratamento de conflitos durante cadastro e edição
- ✅ Tratamento centralizado de exceções
- ✅ Respostas JSON com códigos HTTP adequados

## 🎨 Interface

- ✅ Tela de login
- ✅ Tela de criação de conta
- ✅ Tela de recuperação de senha
- ✅ Painel administrativo
- ✅ Área exclusiva do usuário
- ✅ Tema claro e escuro
- ✅ Layout responsivo
- ✅ Fundo animado com estrelas e meteoros
- ✅ Ilustração SVG animada
- ✅ Transições de carregamento entre as telas
- ✅ Calendário personalizado
- ✅ Seleção e digitação da data de nascimento
- ✅ Máscaras para data, CPF e telefone
- ✅ Modais e notificações personalizados
- ✅ Rodapé padronizado
- ✅ Jogo Pong na área do usuário

---

# 🛠 Tecnologias

## Back-end

- Java 25
- Spring Boot 4.1
- Spring Web MVC
- Spring Data JPA
- Hibernate
- Jakarta Validation
- Maven

## Banco de dados

- PostgreSQL 18

## Front-end

- HTML5
- CSS3
- JavaScript ES6
- SVG
- Local Storage

## Ferramentas

- IntelliJ IDEA
- Git
- GitHub
- Insomnia
- PostgreSQL

---

# 📂 Estrutura do projeto

```text
crud-usuarios
│
├── src
│   └── main
│       ├── java
│       │   └── br.com.gabryel.crud_usuarios
│       │       ├── controller
│       │       │   ├── AuthController.java
│       │       │   └── UsuarioController.java
│       │       │
│       │       ├── entity
│       │       │   ├── Perfil.java
│       │       │   └── Usuario.java
│       │       │
│       │       ├── repository
│       │       │   └── UsuarioRepository.java
│       │       │
│       │       ├── service
│       │       │   └── UsuarioService.java
│       │       │
│       │       ├── exception
│       │       │   ├── GlobalExceptionHandler.java
│       │       │   └── ResourceNotFoundException.java
│       │       │
│       │       └── CrudUsuariosApplication.java
│       │
│       └── resources
│           ├── static
│           │   ├── assets
│           │   │   ├── favicon.ico
│           │   │   ├── Gabryel Paiva-Logo.png
│           │   │   ├── Login-SVG.svg
│           │   │   └── Logo-UNIT.png
│           │   │
│           │   ├── css
│           │   │   └── style.css
│           │   │
│           │   ├── js
│           │   │   ├── admin.js
│           │   │   ├── js.js
│           │   │   ├── login.js
│           │   │   └── usuario.js
│           │   │
│           │   ├── admin.html
│           │   ├── index.html
│           │   └── usuario.html
│           │
│           ├── application.properties
│           └── schema.sql
│
├── pom.xml
└── README.md
```

---

# ⚙️ Como executar

## 1. Clone o projeto

```bash
git clone https://github.com/GabryelPaivaDev/crud-usuarios.git
```

## 2. Entre na pasta

```bash
cd crud-usuarios
```

## 3. Configure o PostgreSQL

Crie um banco de dados chamado:

```text
crud_usuarios
```

Depois, configure o arquivo:

```text
src/main/resources/application.properties
```

Exemplo:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/crud_usuarios
spring.datasource.username=postgres
spring.datasource.password=sua_senha

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

> Substitua `sua_senha` pela senha configurada no seu PostgreSQL.

## 4. Crie a tabela

O projeto acompanha o arquivo:

```text
src/main/resources/schema.sql
```

Ele contém a estrutura necessária para a criação da tabela `usuarios`.

A configuração `spring.jpa.hibernate.ddl-auto=update` também permite que o Hibernate atualize a estrutura durante a inicialização.

## 5. Execute o projeto

Inicie a classe:

```text
CrudUsuariosApplication.java
```

Também é possível executar pelo Maven:

### Windows

```bash
mvnw.cmd spring-boot:run
```

### Linux ou macOS

```bash
./mvnw spring-boot:run
```

## 6. Abra no navegador

```text
http://localhost:8080
```

---

# 🔑 Administrador inicial

Na primeira execução, o sistema cria automaticamente um administrador caso ele ainda não exista.

```text
E-mail: admin@unit.edu.br
Senha: admin123
```

> Recomenda-se alterar essas credenciais antes de utilizar o projeto fora de um ambiente acadêmico.

---

# 🌐 Endpoints da API

## Autenticação

| Método | Endpoint | Descrição |
|---|---|---|
| POST | `/auth/login` | Autentica um usuário |
| POST | `/auth/register` | Cadastra uma nova conta |
| POST | `/auth/password` | Redefine a senha do usuário |

## Usuários

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/usuarios` | Lista todos os usuários ativos |
| GET | `/usuarios/{id}` | Busca um usuário ativo por ID |
| POST | `/usuarios` | Cadastra um usuário |
| PUT | `/usuarios/{id}` | Atualiza um usuário |
| DELETE | `/usuarios/{id}` | Realiza a exclusão lógica do usuário |

---

# 💾 Banco de dados

A aplicação utiliza a tabela:

```text
usuarios
```

## Campos

| Campo | Descrição |
|---|---|
| `id` | Chave primária |
| `nome` | Nome do usuário |
| `email` | E-mail único |
| `senha` | Senha utilizada na autenticação |
| `cpf` | CPF único |
| `telefone` | Telefone único |
| `data_nascimento` | Data de nascimento |
| `data_cadastro` | Data de cadastro |
| `ativo` | Indica se o usuário está ativo |
| `data_acao` | Data e hora da última ação |
| `perfil` | Perfil `ADMIN` ou `USER` |

A exclusão dos usuários é lógica. Portanto, o registro não é removido fisicamente do banco: o campo `ativo` passa a indicar que o usuário foi desativado.

---

# 🖥️ Telas

## Tela de autenticação

A página inicial reúne os fluxos de:

- Login
- Criação de conta
- Recuperação de senha
- Tema claro e escuro
- Calendário personalizado
- Digitação formatada da data de nascimento
- Animações e transições de carregamento

## Painel administrativo

O administrador pode:

- Visualizar usuários ativos
- Cadastrar usuários
- Consultar informações
- Editar usuários
- Excluir usuários logicamente
- Utilizar filtros e elementos interativos do painel

## Área do usuário

O usuário comum possui uma página exclusiva com:

- Informações de acesso
- Tema claro e escuro
- Jogo Pong
- Controle de dificuldade e velocidade
- Suporte ao teclado e ao mouse

---

# ⚠️ Observação de segurança

Este projeto foi desenvolvido para fins acadêmicos.

A autenticação implementada é simplificada e ainda não utiliza:

- Spring Security
- JWT
- Criptografia de senha com BCrypt
- Sessão autenticada no servidor
- Controle de autorização nos endpoints

Para utilização em produção, essas funcionalidades de segurança devem ser implementadas. As senhas também não devem ser armazenadas em texto puro.

---

# 👨‍💻 Autor

## Gabryel Paiva

Projeto desenvolvido para fins acadêmicos durante a disciplina de Residencia de Software III.

GitHub: [GabryelPaivaDev](https://github.com/GabryelPaivaDev)

---

<div align="center">

### ⭐ Se este projeto foi útil, deixe uma estrela no repositório!

</div>
