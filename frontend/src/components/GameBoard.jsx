import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { RotateCcw, Zap, AlertTriangle, Trophy } from 'lucide-react'
import axios from 'axios'
import HangmanDisplay from './HangmanDisplay'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function GameBoard({ playerName, apiUrl, onResetGame }) {
  const [gameState, setGameState] = useState(null)
  const [loading, setLoading] = useState(false)
  const [gameId, setGameId] = useState(null)

  useEffect(() => {
    startNewGame()
  }, [])

  const startNewGame = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/game/new`)
      setGameState({
        gameId: response.data.game_id,
        category: response.data.category,
        hint: response.data.hint,
        wordDisplay: response.data.word_display,
        guessedLetters: [],
        wrongGuesses: 0,
        maxWrong: response.data.max_wrong,
        status: 'playing',
        points: 0,
        message: 'Boa sorte! 🚀'
      })
      setGameId(response.data.game_id)
    } catch (error) {
      toast.error('Erro ao iniciar novo jogo')
    } finally {
      setLoading(false)
    }
  }

  const makeGuess = async (letter) => {
    if (!gameId || gameState.status !== 'playing') return

    setLoading(true)
    try {
      const response = await axios.post(`${apiUrl}/game/guess`, {
        game_id: gameId,
        letter: letter,
        user_name: playerName
      })

      setGameState({
        gameId: response.data.game_id,
        category: gameState.category,
        hint: response.data.hint,
        wordDisplay: response.data.word_display,
        guessedLetters: response.data.guessed_letters,
        wrongGuesses: response.data.wrong_guesses,
        maxWrong: response.data.max_wrong,
        status: response.data.status,
        points: response.data.points,
        message: response.data.message
      })

      // Toast feedback
      if (response.data.status === 'won') {
        toast.success(`🏆 VITÓRIA! +${response.data.points} pontos!`, {
          duration: 4000,
          style: {
            background: '#0a0a0a',
            color: '#00ff00',
            border: '1px solid #00ff00',
          }
        })
      } else if (response.data.status === 'lost') {
        toast.error('💀 Game Over!', {
          duration: 4000,
          style: {
            background: '#0a0a0a',
            color: '#ff00ff',
            border: '1px solid #ff00ff',
          }
        })
      } else if (response.data.message.includes('Acertou')) {
        toast.success(response.data.message, {
          style: {
            background: '#0a0a0a',
            color: '#00ffff',
            border: '1px solid #00ffff',
          }
        })
      } else {
        toast.error(response.data.message, {
          style: {
            background: '#0a0a0a',
            color: '#ff00ff',
            border: '1px solid #ff00ff',
          }
        })
      }

    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.detail)
      } else {
        toast.error('Erro ao fazer tentativa')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading && !gameState) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-cyber-blue border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-cyber-blue">Carregando missão...</p>
        </div>
      </div>
    )
  }

  if (!gameState) return null

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Header */}
      <div className="cyber-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-cyber-green">
              👤 {playerName}
            </h2>
            <p className="text-cyber-blue/70">Categoria: {gameState.category}</p>
          </div>
          <div className="text-right">
            <div className="text-cyber-yellow text-xl font-bold">
              ⚡ {gameState.points} pts
            </div>
            <div className="text-cyber-pink text-sm">
              {gameState.wrongGuesses}/{gameState.maxWrong} erros
            </div>
          </div>
        </div>

        {/* Status message */}
        <div className={`p-3 rounded border text-center font-bold ${
          gameState.status === 'won' 
            ? 'border-cyber-green bg-cyber-green/10 text-cyber-green' 
            : gameState.status === 'lost'
            ? 'border-cyber-pink bg-cyber-pink/10 text-cyber-pink'
            : 'border-cyber-blue bg-cyber-blue/10 text-cyber-blue'
        }`}>
          {gameState.message}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Game */}
        <div className="space-y-6">
          {/* Word Display */}
          <div className="cyber-card word-card text-center">
            <h3 className="text-cyber-green font-bold mb-4 flex items-center justify-center">
              <Zap className="w-5 h-5 mr-2" />
              PALAVRA SECRETA
            </h3>
            <div className="word-display mb-4">
              {gameState.wordDisplay}
            </div>
            
            {/* Dica - sempre visível */}
            <div className="text-cyber-blue/80 text-sm mb-4 p-3 bg-cyber-blue/10 rounded-lg border border-cyber-blue/30">
              💡 <strong>Dica:</strong> {gameState.hint}
            </div>
          </div>

          {/* Letter Grid */}
          <div className="cyber-card">
            <h3 className="text-cyber-green font-bold mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              LETRAS
            </h3>
            <div className="grid grid-cols-6 gap-2">
              {ALPHABET.map(letter => {
                const isGuessed = gameState.guessedLetters.includes(letter)
                const isDisabled = isGuessed || gameState.status !== 'playing' || loading
                
                return (
                  <button
                    key={letter}
                    onClick={() => makeGuess(letter)}
                    disabled={isDisabled}
                    className={`letter-button ${
                      isGuessed ? 'opacity-50' : 'hover:scale-110'
                    }`}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={startNewGame}
              disabled={loading}
              className="cyber-button flex-1 flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-5 h-5" />
              <span>NOVA MISSÃO</span>
            </button>
            
            <button
              onClick={onResetGame}
              className="px-6 py-3 bg-transparent border-2 border-cyber-pink text-cyber-pink font-bold uppercase tracking-wider transition-all duration-300 hover:bg-cyber-pink hover:text-cyber-dark"
            >
              SAIR
            </button>
          </div>
        </div>

        {/* Right Side - Hangman */}
        <div className="cyber-card">
          <h3 className="text-cyber-pink font-bold mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            STATUS DA MISSÃO
          </h3>
          
          <HangmanDisplay wrongGuesses={gameState.wrongGuesses} />
          
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-cyber-blue/70">Tentativas restantes:</span>
              <span className="text-cyber-yellow font-bold">
                {gameState.maxWrong - gameState.wrongGuesses}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-cyber-blue/70">Letras tentadas:</span>
              <span className="text-cyber-pink">
                {gameState.guessedLetters.length} / 26
              </span>
            </div>
            
            <div className="w-full bg-cyber-dark border border-cyber-blue/30 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-cyber-green to-cyber-blue h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${((gameState.maxWrong - gameState.wrongGuesses) / gameState.maxWrong) * 100}%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameBoard
