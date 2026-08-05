CREATE TABLE IF NOT EXISTS usuarios (

                                        id BIGSERIAL PRIMARY KEY,

                                        nome VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    cpf VARCHAR(14) NOT NULL UNIQUE,

    telefone VARCHAR(20) NOT NULL,

    data_nascimento DATE NOT NULL,

    data_cadastro DATE NOT NULL

    );