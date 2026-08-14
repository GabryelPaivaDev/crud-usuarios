CREATE TABLE IF NOT EXISTS usuarios (

                                        id BIGSERIAL PRIMARY KEY,

                                        nome VARCHAR(255) NOT NULL,

    email VARCHAR(255) NOT NULL UNIQUE,

    senha VARCHAR(255) NOT NULL,

    cpf VARCHAR(14) NOT NULL UNIQUE,

    telefone VARCHAR(20) NOT NULL UNIQUE,

    data_nascimento DATE NOT NULL,

    data_cadastro DATE NOT NULL DEFAULT CURRENT_DATE,

    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    data_acao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    perfil VARCHAR(20) NOT NULL DEFAULT 'USER'

    );
