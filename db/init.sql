-- Inicialização do banco de dados para Git Game
-- PostgreSQL

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    total_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de jogos
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    word VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    hint TEXT NOT NULL,
    guessed_letters TEXT DEFAULT '',
    wrong_guesses INTEGER DEFAULT 0,
    max_wrong INTEGER DEFAULT 6,
    status VARCHAR(20) DEFAULT 'playing' CHECK (status IN ('playing', 'won', 'lost')),
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finished_at TIMESTAMP NULL
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_total_points ON users(total_points DESC);
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);
CREATE INDEX IF NOT EXISTS idx_games_user_id ON games(user_id);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_games_created_at ON games(created_at);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger para atualizar finished_at quando jogo termina
CREATE OR REPLACE FUNCTION update_game_finished_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status != 'playing' AND OLD.status = 'playing' THEN
        NEW.finished_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_games_finished_at 
    BEFORE UPDATE ON games 
    FOR EACH ROW 
    EXECUTE FUNCTION update_game_finished_at();

-- Inserir dados de exemplo (opcional)
INSERT INTO users (name, total_points) VALUES 
    ('Antonio Junior', 1500),
    ('Raphael Andrade', 1200),
    ('Guilherme Campos', 950),
    ('TerminalGuru', 800),
    ('DevOpsBot', 650)
ON CONFLICT DO NOTHING;

-- Views úteis
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.name,
    u.total_points,
    COUNT(g.id) as total_games,
    COUNT(CASE WHEN g.status = 'won' THEN 1 END) as won_games,
    COUNT(CASE WHEN g.status = 'lost' THEN 1 END) as lost_games,
    CASE 
        WHEN COUNT(g.id) > 0 
        THEN ROUND((COUNT(CASE WHEN g.status = 'won' THEN 1 END)::DECIMAL / COUNT(g.id)) * 100, 2)
        ELSE 0 
    END as win_rate,
    u.created_at,
    u.updated_at
FROM users u
LEFT JOIN games g ON u.id = g.user_id
GROUP BY u.id, u.name, u.total_points, u.created_at, u.updated_at;

-- View para estatísticas globais
CREATE OR REPLACE VIEW global_stats AS
SELECT 
    COUNT(DISTINCT u.id) as total_players,
    COUNT(g.id) as total_games,
    COUNT(CASE WHEN g.status = 'won' THEN 1 END) as won_games,
    COUNT(CASE WHEN g.status = 'lost' THEN 1 END) as lost_games,
    CASE 
        WHEN COUNT(g.id) > 0 
        THEN ROUND((COUNT(CASE WHEN g.status = 'won' THEN 1 END)::DECIMAL / COUNT(g.id)) * 100, 2)
        ELSE 0 
    END as global_win_rate,
    AVG(u.total_points) as avg_points,
    MAX(u.total_points) as max_points
FROM users u
LEFT JOIN games g ON u.id = g.user_id;
