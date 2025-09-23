from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional
import random
import os
from datetime import datetime

# Database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/gitgame")

# SQLAlchemy setup
from sqlalchemy import create_engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# FastAPI app
app = FastAPI(title="Git Game API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir solicitações de qualquer origem
    allow_credentials=False,  # Desabilitar credenciais para permitir wildcard origins
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
def health_check():
    return {"status": "healthy", "message": "GIT GAME API is running!"}

@app.get("/health")
def health():
    return {"status": "healthy"}

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    total_points = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Game(Base):
    __tablename__ = "games"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)  # Permitir jogos anônimos
    word = Column(String(50), nullable=False)
    category = Column(String(50), nullable=False)
    hint = Column(Text, nullable=False)
    guessed_letters = Column(Text, default="")  # JSON string
    wrong_guesses = Column(Integer, default=0)
    max_wrong = Column(Integer, default=6)
    status = Column(String(20), default="playing")  # playing, won, lost
    points = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic models
class GuessRequest(BaseModel):
    game_id: int
    letter: str
    user_name: Optional[str] = None

class GuessResponse(BaseModel):
    game_id: int
    word_display: str
    guessed_letters: List[str]
    wrong_guesses: int
    max_wrong: int
    status: str
    points: int
    message: str
    hint: str
    correct_word: Optional[str] = None

class NewGameResponse(BaseModel):
    game_id: int
    category: str
    hint: str
    word_display: str
    max_wrong: int

class LeaderboardEntry(BaseModel):
    name: str
    total_points: int
    rank: int

# Palavras do jogo com tema Git/GitHub
GIT_WORDS = {
    "git": {
        "words": [
            "COMMIT", "BRANCH", "MERGE", "PUSH", "PULL", "CLONE", "FORK", 
            "REPOSITORY", "REMOTE", "STAGING", "CHECKOUT", "REBASE",
            "STASH", "TAG", "DIFF", "LOG", "STATUS", "ADD", "RESET",
            "ORIGIN", "HEAD", "FETCH", "BLOB", "TREE", "INDEX", "SUBMODULE", "HOOK", "CONFLICT", "TRACK", "IGNORE", "WORKTREE", "FASTFORWARD", "SQUASH", "CHERRY-PICK", "DESCRIBE", "CREDENTIAL", "CONFIG", "GITFLOW", "GITHUB", "GITLAB", "BITBUCKET"
        ],
        "hints": {
            "COMMIT": "Salvar mudanças no repositório",
            "BRANCH": "Linha de desenvolvimento paralela",
            "MERGE": "Combinar duas branches",
            "PUSH": "Enviar commits para repositório remoto",
            "PULL": "Baixar e mesclar mudanças do remoto",
            "CLONE": "Copiar um repositório completo",
            "FORK": "Criar sua própria cópia de um repositório",
            "REPOSITORY": "Local onde o código é armazenado",
            "REMOTE": "Repositório em outro local",
            "STAGING": "Área de preparação antes do commit",
            "CHECKOUT": "Mudar de branch ou restaurar arquivos",
            "REBASE": "Reorganizar histórico de commits",
            "STASH": "Guardar mudanças temporariamente",
            "TAG": "Marcar uma versão específica",
            "DIFF": "Mostrar diferenças entre arquivos",
            "LOG": "Histórico de commits",
            "STATUS": "Estado atual do repositório",
            "ADD": "Adicionar arquivos ao staging",
            "RESET": "Desfazer mudanças",
            "ORIGIN": "Repositório remoto padrão",
            "HEAD": "Referência para o commit atual",
            "FETCH": "Buscar dados do remoto sem mesclar",
            "BLOB": "Objeto de arquivo no Git",
            "TREE": "Estrutura de diretórios e arquivos",
            "INDEX": "Área de indexação do Git",
            "SUBMODULE": "Repositório dentro de outro repositório",
            "HOOK": "Script executado em eventos do Git",
            "CONFLICT": "Quando há alterações incompatíveis",
            "TRACK": "Acompanhar branch remoto",
            "IGNORE": "Arquivos que não serão versionados",
            "WORKTREE": "Cópia de trabalho do repositório",
            "FASTFORWARD": "Atualização linear de branch",
            "SQUASH": "Unir vários commits em um só",
            "CHERRY-PICK": "Aplicar commit específico em outra branch",
            "DESCRIBE": "Mostrar nome de tag mais próxima",
            "CREDENTIAL": "Dados de autenticação do Git",
            "CONFIG": "Arquivo de configuração do Git",
            "GITFLOW": "Modelo de ramificação popular",
            "GITHUB": "Plataforma de hospedagem de código",
            "GITLAB": "Alternativa ao GitHub",
            "BITBUCKET": "Outra plataforma de repositórios"
        }
    },
    "github": {
        "words": [
            "ISSUES", "PULLREQUEST", "ACTIONS", "WORKFLOWS", "PAGES",
            "RELEASES", "WIKI", "GIST", "COPILOT", "CODESPACES"
        ],
        "hints": {
            "ISSUES": "Sistema de rastreamento de bugs e tarefas",
            "PULLREQUEST": "Proposta de mudanças no código",
            "ACTIONS": "CI/CD automático do GitHub",
            "WORKFLOWS": "Sequência de jobs automáticos",
            "PAGES": "Hospedagem gratuita de sites estáticos",
            "RELEASES": "Versões publicadas do software",
            "WIKI": "Documentação colaborativa",
            "GIST": "Compartilhar snippets de código",
            "COPILOT": "IA que ajuda a programar",
            "CODESPACES": "Ambiente de desenvolvimento na nuvem"
        }
    }
}

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "🎮 Git Game API - TFTEC Treinamentos!", "version": "1.0.0"}

@app.get("/game/new", response_model=NewGameResponse)
def new_game(db: Session = Depends(get_db)):
    """Iniciar um novo jogo"""
    
    # Escolher categoria aleatória
    category = random.choice(list(GIT_WORDS.keys()))
    
    # Escolher palavra aleatória da categoria
    word = random.choice(GIT_WORDS[category]["words"])
    hint = GIT_WORDS[category]["hints"][word]
    
    # Criar novo jogo no banco
    game = Game(
        word=word,
        category=category,
        hint=hint,
        guessed_letters="",
        wrong_guesses=0,
        max_wrong=6,
        status="playing"
    )
    
    db.add(game)
    db.commit()
    db.refresh(game)
    
    # Retornar palavra mascarada
    word_display = "_" * len(word)
    
    return NewGameResponse(
        game_id=game.id,
        category=category.upper(),
        hint=hint,
        word_display=word_display,
        max_wrong=6
    )

@app.post("/game/guess", response_model=GuessResponse)
def make_guess(guess: GuessRequest, db: Session = Depends(get_db)):
    """Fazer uma tentativa de letra"""
    
    game = db.query(Game).filter(Game.id == guess.game_id).first()
    if not game:
        raise HTTPException(status_code=404, detail="Jogo não encontrado")
    
    if game.status != "playing":
        raise HTTPException(status_code=400, detail="Jogo já finalizado")
    
    letter = guess.letter.upper()
    guessed_letters = game.guessed_letters.split(",") if game.guessed_letters else []
    
    if letter in guessed_letters:
        raise HTTPException(status_code=400, detail="Letra já foi tentada")
    
    # Adicionar letra às tentativas
    guessed_letters.append(letter)
    game.guessed_letters = ",".join(guessed_letters)
    
    message = ""
    
    # Verificar se acertou
    if letter in game.word:
        message = f"🎯 Acertou! A letra '{letter}' está na palavra!"
        
        # Verificar se completou a palavra
        word_display = ""
        for char in game.word:
            if char in guessed_letters:
                word_display += char
            else:
                word_display += "_"
        
        if "_" not in word_display:
            game.status = "won"
            game.points = max(100 - (game.wrong_guesses * 10), 10)
            message = f"🏆 PARABÉNS! Você venceu! +{game.points} pontos!"
            
            # Atualizar pontos do usuário se fornecido
            if guess.user_name:
                user = db.query(User).filter(User.name == guess.user_name).first()
                if not user:
                    user = User(name=guess.user_name, total_points=0)
                    db.add(user)
                user.total_points += game.points
                game.user_id = user.id
    else:
        game.wrong_guesses += 1
        message = f"❌ Ops! A letra '{letter}' não está na palavra."
        
        if game.wrong_guesses >= game.max_wrong:
            game.status = "lost"
            message = "💀 Game Over!"
    
    db.commit()
    
    # Preparar resposta
    word_display = ""
    for char in game.word:
        if char in guessed_letters:
            word_display += char + " "
        else:
            word_display += "_ "
    
    # Buscar a dica básica
    category_words = GIT_WORDS.get(game.category, {})
    basic_hint = category_words.get("hints", {}).get(game.word, "Nenhuma dica disponível")
    
    return GuessResponse(
        game_id=game.id,
        word_display=word_display.strip(),
        guessed_letters=guessed_letters,
        wrong_guesses=game.wrong_guesses,
        max_wrong=game.max_wrong,
        status=game.status,
        points=game.points,
        message=message,
        hint=basic_hint,
        correct_word=game.word if game.status == "lost" else None
    )

@app.get("/leaderboard", response_model=List[LeaderboardEntry])
def get_leaderboard(limit: int = 10, db: Session = Depends(get_db)):
    """Obter ranking dos jogadores"""
    
    users = db.query(User).order_by(User.total_points.desc()).limit(limit).all()
    
    leaderboard = []
    for i, user in enumerate(users, 1):
        leaderboard.append(LeaderboardEntry(
            name=user.name,
            total_points=user.total_points,
            rank=i
        ))
    
    return leaderboard

@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """Estatísticas gerais do jogo"""
    
    total_games = db.query(Game).count()
    won_games = db.query(Game).filter(Game.status == "won").count()
    total_players = db.query(User).count()
    
    win_rate = (won_games / total_games * 100) if total_games > 0 else 0
    
    return {
        "total_games": total_games,
        "won_games": won_games,
        "total_players": total_players,
        "win_rate": round(win_rate, 2)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
