# CRUD de Usuários

Projeto desenvolvido como atividade prática da disciplina de Desenvolvimento Web.

## Tecnologias utilizadas

### Back-end
- Java 26
- Spring Boot 4
- Spring Web
- Spring Data JPA
- Hibernate
- PostgreSQL

### Front-end
- HTML5
- CSS3
- JavaScript

## Funcionalidades

O sistema permite:

- Cadastro de usuários
- Listagem de usuários
- Busca de usuário por ID
- Atualização de usuários
- Exclusão de usuários
- Validação de campos obrigatórios
- Validação de CPF e telefone
- Alternância entre tema claro e escuro
- Interface responsiva

## Estrutura do projeto

```
src
 └── main
      ├── java
      │     └── br.com.gabryel.crud_usuarios
      │             ├── controller
      │             ├── entity
      │             ├── repository
      │             ├── service
      │             └── CrudUsuariosApplication.java
      │
      └── resources
            ├── static
            │      ├── index.html
            │      ├── style.css
            │      └── js.js
            │
            ├── schema.sql
            └── application.properties
```

## Banco de Dados

Banco utilizado:

PostgreSQL

Nome do banco:

```
crud_usuarios
```

Tabela:

```
usuarios
```

## Como executar

### 1 - Clonar o projeto

```bash
git clone <link-do-repositório>
```

### 2 - Abrir no IntelliJ IDEA

Abrir a pasta do projeto normalmente.

### 3 - Criar o banco PostgreSQL

Criar um banco chamado:

```
crud_usuarios
```

### 4 - Configurar o application.properties

Exemplo:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/crud_usuarios
spring.datasource.username=postgres
spring.datasource.password=123456

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 5 - Executar a aplicação

Rodar a classe:

```
CrudUsuariosApplication.java
```

### 6 - Acessar

Interface:

```
http://localhost:8080
```

API:

```
GET     /usuarios
GET     /usuarios/{id}
POST    /usuarios
PUT     /usuarios/{id}
DELETE  /usuarios/{id}
```

## Autor

Gabryel Paiva