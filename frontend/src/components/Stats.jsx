import { useState, useEffect } from 'react'
import { BarChart, TrendingUp, Users, Target } from 'lucide-react'
import axios from 'axios'

function Stats({ apiUrl }) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${apiUrl}/stats`)
      setStats(response.data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar estatísticas')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="cyber-card">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-cyber-blue border-t-transparent rounded-full"></div>
            <span className="ml-4 text-cyber-blue">Carregando estatísticas...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="cyber-card">
          <div className="text-center py-12">
            <p className="text-cyber-pink mb-4">❌ {error}</p>
            <button
              onClick={fetchStats}
              className="cyber-button"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  const getWinRateColor = (rate) => {
    if (rate >= 70) return 'text-cyber-green'
    if (rate >= 50) return 'text-cyber-yellow'
    return 'text-cyber-pink'
  }

  const getWinRateMessage = (rate) => {
    if (rate >= 80) return 'Excelente! 🏆'
    if (rate >= 60) return 'Muito bom! 👍'
    if (rate >= 40) return 'Razoável 😐'
    return 'Precisa melhorar 💪'
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="cyber-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold glow-text flex items-center">
            <BarChart className="w-8 h-8 mr-3 text-cyber-green" />
            ESTATÍSTICAS GLOBAIS
          </h2>
          <button
            onClick={fetchStats}
            className="px-4 py-2 border border-cyber-blue/50 text-cyber-blue text-sm hover:border-cyber-blue transition-all"
          >
            🔄 Atualizar
          </button>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Games */}
          <div className="cyber-card border-cyber-blue bg-cyber-blue/5">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-cyber-blue" />
              <div className="text-right">
                <div className="text-3xl font-bold text-cyber-blue">
                  {stats.total_games.toLocaleString()}
                </div>
                <div className="text-sm text-cyber-blue/70">Total de Jogos</div>
              </div>
            </div>
            <div className="text-xs text-cyber-blue/50">
              Jogos executados na plataforma
            </div>
          </div>

          {/* Won Games */}
          <div className="cyber-card border-cyber-green bg-cyber-green/5">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-cyber-green" />
              <div className="text-right">
                <div className="text-3xl font-bold text-cyber-green">
                  {stats.won_games.toLocaleString()}
                </div>
                <div className="text-sm text-cyber-green/70">Vitórias</div>
              </div>
            </div>
            <div className="text-xs text-cyber-green/50">
              Missões completadas com sucesso
            </div>
          </div>

          {/* Total Players */}
          <div className="cyber-card border-cyber-purple bg-cyber-purple/5">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-cyber-purple" />
              <div className="text-right">
                <div className="text-3xl font-bold text-cyber-purple">
                  {stats.total_players.toLocaleString()}
                </div>
                <div className="text-sm text-cyber-purple/70">Hackers</div>
              </div>
            </div>
            <div className="text-xs text-cyber-purple/50">
              Jogadores registrados
            </div>
          </div>

          {/* Win Rate */}
          <div className={`cyber-card border-current bg-current/5 ${getWinRateColor(stats.win_rate)}`}>
            <div className="flex items-center justify-between mb-4">
              <BarChart className="w-8 h-8" />
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {stats.win_rate}%
                </div>
                <div className="text-sm opacity-70">Taxa de Vitória</div>
              </div>
            </div>
            <div className="text-xs opacity-50">
              {getWinRateMessage(stats.win_rate)}
            </div>
          </div>
        </div>

        {/* Win Rate Progress Bar */}
        <div className="cyber-card mb-8">
          <h3 className="text-xl font-bold text-cyber-green mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Taxa de Sucesso da Comunidade
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-cyber-blue/70">Progresso Global</span>
              <span className={`font-bold ${getWinRateColor(stats.win_rate)}`}>
                {stats.win_rate}% de sucesso
              </span>
            </div>
            
            <div className="w-full bg-cyber-dark border-2 border-cyber-blue/30 rounded-full h-6 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ease-out ${
                  stats.win_rate >= 70 
                    ? 'bg-gradient-to-r from-cyber-green to-cyber-blue' 
                    : stats.win_rate >= 50
                    ? 'bg-gradient-to-r from-cyber-yellow to-cyber-green'
                    : 'bg-gradient-to-r from-cyber-pink to-cyber-yellow'
                }`}
                style={{ width: `${Math.min(stats.win_rate, 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-cyber-blue/50">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance Analysis */}
          <div className="cyber-card">
            <h3 className="text-xl font-bold text-cyber-blue mb-4">
              📊 Análise de Performance
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-cyber-blue/70">Jogos perdidos:</span>
                <span className="text-cyber-pink font-bold">
                  {(stats.total_games - stats.won_games).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyber-blue/70">Taxa de falha:</span>
                <span className="text-cyber-pink font-bold">
                  {(100 - stats.win_rate).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-cyber-blue/70">Média por jogador:</span>
                <span className="text-cyber-yellow font-bold">
                  {stats.total_players > 0 
                    ? (stats.total_games / stats.total_players).toFixed(1)
                    : '0'
                  } jogos
                </span>
              </div>
            </div>
          </div>

          {/* Community Status */}
          <div className="cyber-card">
            <h3 className="text-xl font-bold text-cyber-green mb-4">
              🌐 Status da Comunidade
            </h3>
            <div className="space-y-3">
              <div className={`p-3 rounded border ${
                stats.total_players > 50 
                  ? 'border-cyber-green bg-cyber-green/10 text-cyber-green'
                  : stats.total_players > 10
                  ? 'border-cyber-yellow bg-cyber-yellow/10 text-cyber-yellow'
                  : 'border-cyber-pink bg-cyber-pink/10 text-cyber-pink'
              }`}>
                <div className="font-bold">
                  {stats.total_players > 50 
                    ? '🔥 Comunidade Ativa!'
                    : stats.total_players > 10
                    ? '⚡ Crescendo!'
                    : '🌱 Iniciando...'
                  }
                </div>
                <div className="text-sm opacity-70">
                  {stats.total_players} hackers na base
                </div>
              </div>
              
              <div className="text-center pt-4">
                <div className="text-2xl mb-2">🎮</div>
                <p className="text-cyber-blue/60 text-sm">
                  Convide mais hackers para crescer a comunidade!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer message */}
        <div className="mt-8 pt-6 border-t border-cyber-blue/30 text-center">
          <p className="text-cyber-blue/60 text-sm">
            💡 Estatísticas atualizadas em tempo real • 
            Dados da comunidade Git Game
          </p>
        </div>
      </div>
    </div>
  )
}

export default Stats
