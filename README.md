<div align="center">

# 🚀 CRUD de Usuários

Sistema completo de gerenciamento de usuários desenvolvido com **Java + Spring Boot + PostgreSQL**.

Projeto desenvolvido como atividade prática da disciplina de Desenvolvimento Web.

<br>

<img src="https://img.shields.io/badge/Java-26-red?style=for-the-badge&logo=openjdk">
<img src="https://img.shields.io/badge/Spring_Boot-4.1-success?style=for-the-badge&logo=springboot">
<img src="https://img.shields.io/badge/PostgreSQL-18-blue?style=for-the-badge&logo=postgresql">
<img src="https://img.shields.io/badge/HTML5-orange?style=for-the-badge&logo=html5">
<img src="https://img.shields.io/badge/CSS3-blue?style=for-the-badge&logo=css3">
<img src="https://img.shields.io/badge/JavaScript-yellow?style=for-the-badge&logo=javascript">

</div>

---

# 📖 Sobre

Este projeto consiste em um sistema completo de **CRUD (Create, Read, Update e Delete)** para gerenciamento de usuários.

A aplicação foi desenvolvida utilizando **arquitetura em camadas**, separando:

- Controller
- Service
- Repository
- Entity
- Banco de Dados
- Front-end

Toda comunicação entre a interface e o banco ocorre através de uma **API REST** desenvolvida com Spring Boot.

---

# ✨ Funcionalidades

- ✅ Cadastro de usuários
- ✅ Listagem de usuários
- ✅ Consulta por ID
- ✅ Atualização de usuários
- ✅ Exclusão de usuários
- ✅ API REST
- ✅ Arquitetura em camadas
- ✅ Validação de campos obrigatórios
- ✅ Validação de CPF
- ✅ Validação de telefone
- ✅ Data de cadastro automática
- ✅ Tratamento de usuário não encontrado
- ✅ Interface responsiva
- ✅ Tema Claro / Escuro
- ✅ Comunicação Front-end ↔ Back-end

---

# 🛠 Tecnologias

## Back-end

- Java 26
- Spring Boot 4.1
- Spring Data JPA
- Hibernate
- Jakarta Validation
- Maven

## Banco de Dados

- PostgreSQL

## Front-end

- HTML5
- CSS3
- JavaScript (ES6)

## Ferramentas

- IntelliJ IDEA
- Git
- GitHub
- Insomnia

---

# 📂 Estrutura

```text
crud-usuarios
│
├── src
│   └── main
│       ├── java
│       │   └── br.com.gabryel.crud_usuarios
│       │       ├── controller
│       │       │     └── UsuarioController.java
│       │       │
│       │       ├── entity
│       │       │     └── Usuario.java
│       │       │
│       │       ├── repository
│       │       │     └── UsuarioRepository.java
│       │       │
│       │       ├── service
│       │       │     └── UsuarioService.java
│       │       │
│       │       └── CrudUsuariosApplication.java
│       │
│       └── resources
│           ├── static
│           │     ├── index.html
│           │     ├── style.css
│           │     └── js.js
│           │
│           ├── application.properties
│           └── schema.sql
│
├── pom.xml
└── README.md
```

---

# ⚙ Como executar

### Clone o projeto

```bash
git clone https://github.com/SEU-USUARIO/crud-usuarios.git
```

---

### Entre na pasta

```bash
cd crud-usuarios
```

---

### Configure o PostgreSQL

Crie um banco chamado

```text
crud_usuarios
```

Configure o arquivo

```text
src/main/resources/application.properties
```

com suas credenciais do PostgreSQL.

---

### Execute

Basta iniciar a classe

```text
CrudUsuariosApplication.java
```

---

### Abra no navegador

```text
http://localhost:8080
```

---

# 🌐 Endpoints da API

| Método | Endpoint | Descrição |
|---------|----------|-----------|
| GET | /usuarios | Lista todos |
| GET | /usuarios/{id} | Busca por ID |
| POST | /usuarios | Cadastra usuário |
| PUT | /usuarios/{id} | Atualiza usuário |
| DELETE | /usuarios/{id} | Remove usuário |

---

# 💾 Banco de Dados

Tabela utilizada

```text
usuarios
```

Campos

- id
- nome
- email
- cpf
- telefone
- dataNascimento
- dataCadastro

Também acompanha o arquivo

```text
schema.sql
```

para criação da estrutura do banco.

---

# 🎨 Interface

A aplicação possui:

- 🌙 Tema Escuro
- ☀️ Tema Claro
- ✨ Fundo animado com estrelas
- 📱 Layout responsivo
- 📝 Formulário para cadastro e edição
- 📋 Tabela dinâmica
- 🎭 Interface moderna inspirada em dashboards

---

# 👨‍💻 Autor

## Gabryel Paiva

Projeto desenvolvido para fins acadêmicos.

---

<div align="center">

### ⭐ Se este projeto foi útil, deixe uma estrela no repositório!

</div>
