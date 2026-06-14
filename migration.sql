CREATE TABLE IF NOT EXISTS motoristas (
    id            SERIAL PRIMARY KEY,
    nome          VARCHAR(150) NOT NULL,
    cpf           VARCHAR(14)  NOT NULL UNIQUE,
    placa_veiculo VARCHAR(10)  NOT NULL,
    status        VARCHAR(10)  NOT NULL DEFAULT 'ATIVO'
                  CHECK (status IN ('ATIVO', 'INATIVO'))
);

CREATE TABLE IF NOT EXISTS entregas (
    id           SERIAL PRIMARY KEY,
    descricao    VARCHAR(255) NOT NULL,
    origem       VARCHAR(120) NOT NULL,
    destino      VARCHAR(120) NOT NULL,
    status       VARCHAR(20)  NOT NULL DEFAULT 'CRIADA'
                 CHECK (status IN ('CRIADA', 'EM_TRANSITO', 'ENTREGUE', 'CANCELADA')),
    motorista_id INTEGER NULL REFERENCES motoristas(id)
);

CREATE TABLE IF NOT EXISTS eventos_entrega (
    id         SERIAL PRIMARY KEY,
    entrega_id INTEGER      NOT NULL REFERENCES entregas(id) ON DELETE CASCADE,
    data       TIMESTAMP    NOT NULL DEFAULT NOW(),
    descricao  VARCHAR(500) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_entregas_status    ON entregas(status);
CREATE INDEX IF NOT EXISTS idx_entregas_motorista ON entregas(motorista_id);
CREATE INDEX IF NOT EXISTS idx_eventos_entrega_id ON eventos_entrega(entrega_id);