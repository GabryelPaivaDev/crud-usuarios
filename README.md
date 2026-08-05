<div align="center">

# 🚀 CRUD de Usuários

Sistema de gerenciamento de usuários desenvolvido com **Java + Spring Boot + PostgreSQL**.

Projeto desenvolvido como atividade prática da disciplina de Desenvolvimento Web.

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

A aplicação foi desenvolvida utilizando arquitetura em camadas, separando o Back-end, Banco de Dados e Front-end.

---

# ✨ Funcionalidades

- ✅ Cadastro de usuários
- ✅ Listagem de usuários
- ✅ Consulta por ID
- ✅ Atualização de usuários
- ✅ Exclusão de usuários
- ✅ Validação de campos obrigatórios
- ✅ Validação de CPF
- ✅ Validação de telefone
- ✅ Interface responsiva
- ✅ Tema Claro / Escuro
- ✅ Comunicação Front-end ↔ API REST

---

# 🛠 Tecnologias

## Back-end

- Java 26
- Spring Boot
- Spring Data JPA
- Hibernate
- Maven

## Banco de Dados

- PostgreSQL

## Front-end

- HTML5
- CSS3
- JavaScript

---

# 📂 Estrutura

```
crud-usuarios
│
├── src
│   └── main
│       ├── java
│       │   └── br.com.gabryel.crud_usuarios
│       │       ├── controller
│       │       ├── entity
│       │       ├── repository
│       │       ├── service
│       │       └── CrudUsuariosApplication
│       │
│       └── resources
│           ├── static
│           │   ├── index.html
│           │   ├── style.css
│           │   └── js.js
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

```
crud_usuarios
```

Depois configure o arquivo

```
application.properties
```

---

### Execute

Basta iniciar a classe

```
CrudUsuariosApplication.java
```

---

### Abra no navegador

```
http://localhost:8080
```

---

# 🌐 Pontos finais

| Método | Ponto final | Descrição |
|---------|----------|-----------|
| PEGAR | /usuários | Lista todos |
| PEGAR | /usuários/{id} | Busca por ID |
| POSTAR | /usuários | Cadastra usuário |
| COLOCAR | /usuários/{id} | Atualiza usuário |
| EXCLUIR | /usuários/{id} | Remover usuário |

---

# 💾 Banco de Dados

Tabela utilizada:

```
usuários
```

Campos:

- id
- nome
- e-mail
- cpf
- telefone
- dadosNascimento
- dadosCadastro

---

# 👨‍💻 Autor

### Gabryel Paiva

Projeto desenvolvido para fins acadêmicos.
