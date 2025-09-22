import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { Terminal, Zap, Trophy, Gamepad2 } from 'lucide-react'
import GameBoard from './components/GameBoard'
import Leaderboard from './components/Leaderboard'
import Stats from './components/Stats'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [currentView, setCurrentView] = useState('game')
  const [playerName, setPlayerName] = useState('')
  const [isGameStarted, setIsGameStarted] = useState(false)

  useEffect(() => {
    // Carregar nome do jogador do localStorage
    const savedName = localStorage.getItem('playerName')
    if (savedName) {
      setPlayerName(savedName)
    }
  }, [])

  const handleNameSubmit = (name) => {
    setPlayerName(name)
    localStorage.setItem('playerName', name)
    setIsGameStarted(true)
    toast.success(`🎮 Bem-vindo(a), ${name}!`, {
      style: {
        background: '#0a0a0a',
        color: '#00ffff',
        border: '1px solid #00ffff',
      }
    })
  }

  const resetGame = () => {
    setIsGameStarted(false)
    setPlayerName('')
    localStorage.removeItem('playerName')
  }

  return (
    <div className="min-h-screen bg-cyber-dark text-cyber-blue">
      <Toaster position="top-center" />
      
      {/* Header */}
      <header className="cyber-border border-b-2 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Terminal className="w-8 h-8 text-cyber-green animate-pulse" />
            <h1 className="text-3xl font-bold glow-text">
              GIT GAME
            </h1>
          </div>
          
          <nav className="flex space-x-4">
            <button
              onClick={() => setCurrentView('game')}
              className={`flex items-center space-x-2 px-4 py-2 border rounded transition-all ${
                currentView === 'game' 
                  ? 'border-cyber-blue bg-cyber-blue/20 text-cyber-blue' 
                  : 'border-cyber-blue/30 text-cyber-blue/70 hover:border-cyber-blue/60'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>JOGO</span>
            </button>
            
            <button
              onClick={() => setCurrentView('leaderboard')}
              className={`flex items-center space-x-2 px-4 py-2 border rounded transition-all ${
                currentView === 'leaderboard' 
                  ? 'border-cyber-blue bg-cyber-blue/20 text-cyber-blue' 
                  : 'border-cyber-blue/30 text-cyber-blue/70 hover:border-cyber-blue/60'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>RANKING</span>
            </button>
            
            <button
              onClick={() => setCurrentView('stats')}
              className={`flex items-center space-x-2 px-4 py-2 border rounded transition-all ${
                currentView === 'stats' 
                  ? 'border-cyber-blue bg-cyber-blue/20 text-cyber-blue' 
                  : 'border-cyber-blue/30 text-cyber-blue/70 hover:border-cyber-blue/60'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>STATS</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-6">
        {currentView === 'game' && (
          <>
            {!isGameStarted ? (
              <WelcomeScreen onNameSubmit={handleNameSubmit} />
            ) : (
              <GameBoard 
                playerName={playerName} 
                apiUrl={API_URL}
                onResetGame={resetGame}
              />
            )}
          </>
        )}
        
        {currentView === 'leaderboard' && (
          <Leaderboard apiUrl={API_URL} />
        )}
        
        {currentView === 'stats' && (
          <Stats apiUrl={API_URL} />
        )}
      </main>

      {/* Footer */}
      <footer className="cyber-border border-t-2 p-4 mt-12">
        <div className="container mx-auto text-center">
          <p className="text-cyber-blue/60 text-sm">
            🎮 Git Game - Aprenda Git/GitHub de forma divertida!
          </p>
        </div>
      </footer>
    </div>
  )
}

// Welcome Screen Component
function WelcomeScreen({ onNameSubmit }) {
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (name.trim().length >= 2) {
      onNameSubmit(name.trim())
    } else {
      toast.error('Nome deve ter pelo menos 2 caracteres')
    }
  }

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="cyber-card mb-8">
        <div className="mb-6">
          <h2 className="text-5xl font-bold glow-text mb-4">
            WELCOME TO THE MATRIX
          </h2>
          <p className="text-xl text-cyber-green mb-2">
            🎯 Adivinhe palavras relacionadas a Git e GitHub
          </p>
          <p className="text-cyber-blue/70">
            Digite seu nome de hacker para começar a missão...
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome de hacker..."
              className="w-full px-4 py-3 bg-cyber-dark/80 border-2 border-cyber-blue/50 text-cyber-blue placeholder-cyber-blue/40 rounded focus:border-cyber-blue focus:outline-none focus:ring-2 focus:ring-cyber-blue/20 transition-all"
              maxLength={20}
              required
            />
          </div>
          
          <button
            type="submit"
            className="cyber-button w-full py-4 text-xl"
            disabled={name.trim().length < 2}
          >
            <span className="flex items-center justify-center space-x-2">
              <Terminal className="w-6 h-6" />
              <span>INICIAR MISSÃO</span>
            </span>
          </button>
        </form>

        <div className="mt-8 p-4 border border-cyber-green/30 rounded bg-cyber-green/5">
          <h3 className="text-cyber-green font-bold mb-2">REGRAS DA MISSÃO:</h3>
          <ul className="text-sm text-cyber-blue/80 space-y-1">
            <li>• Adivinhe palavras relacionadas a Git/GitHub</li>
            <li>• Você tem 6 tentativas incorretas</li>
            <li>• Ganhe pontos por cada vitória</li>
            <li>• Compete no ranking global</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
