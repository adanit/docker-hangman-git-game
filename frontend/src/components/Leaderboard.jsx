import { useState, useEffect } from 'react'
import { Trophy, Medal, Award, Crown } from 'lucide-react'
import axios from 'axios'

function Leaderboard({ apiUrl }) {
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${apiUrl}/leaderboard?limit=20`)
      setLeaderboard(response.data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar ranking')
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-neon-yellow" />
      case 2:
        return <Trophy className="w-6 h-6 text-cyber-blue" />
      case 3:
        return <Medal className="w-6 h-6 text-cyber-pink" />
      default:
        return <Award className="w-5 h-5 text-cyber-green" />
    }
  }

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'text-neon-yellow border-neon-yellow bg-neon-yellow/10'
      case 2:
        return 'text-cyber-blue border-cyber-blue bg-cyber-blue/10'
      case 3:
        return 'text-cyber-pink border-cyber-pink bg-cyber-pink/10'
      default:
        return 'text-cyber-green border-cyber-green/30 bg-cyber-green/5'
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="cyber-card">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-cyber-blue border-t-transparent rounded-full"></div>
            <span className="ml-4 text-cyber-blue">Carregando ranking...</span>
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
              onClick={fetchLeaderboard}
              className="cyber-button"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="cyber-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold glow-text flex items-center">
            <Trophy className="w-8 h-8 mr-3 text-cyber-yellow" />
            HALL DA FAMA
          </h2>
          <button
            onClick={fetchLeaderboard}
            className="px-4 py-2 border border-cyber-blue/50 text-cyber-blue text-sm hover:border-cyber-blue transition-all"
          >
            🔄 Atualizar
          </button>
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎮</div>
            <p className="text-cyber-blue text-xl mb-2">Nenhum jogador ainda!</p>
            <p className="text-cyber-blue/60">Seja o primeiro a aparecer no ranking!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Top 3 - Destaque */}
            {leaderboard.slice(0, 3).map((player) => (
              <div
                key={player.rank}
                className={`p-6 border-2 rounded-lg transition-all duration-300 hover:scale-[1.02] ${getRankColor(player.rank)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-current">
                      {getRankIcon(player.rank)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{player.name}</h3>
                      <p className="text-sm opacity-70">#{player.rank} no ranking</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      ⚡ {player.total_points.toLocaleString()}
                    </div>
                    <p className="text-sm opacity-70">pontos</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Demais jogadores */}
            {leaderboard.slice(3).length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-cyber-green mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Outros Hackers
                </h3>
                <div className="space-y-2">
                  {leaderboard.slice(3).map((player) => (
                    <div
                      key={player.rank}
                      className="flex items-center justify-between p-4 border border-cyber-green/30 rounded bg-cyber-green/5 hover:bg-cyber-green/10 transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full border border-cyber-green flex items-center justify-center text-sm font-bold">
                          {player.rank}
                        </div>
                        <span className="font-medium">{player.name}</span>
                      </div>
                      <div className="text-cyber-yellow font-bold">
                        ⚡ {player.total_points.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Informações adicionais */}
        <div className="mt-8 pt-6 border-t border-cyber-blue/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 border border-cyber-blue/30 rounded bg-cyber-blue/5">
              <div className="text-2xl font-bold text-cyber-blue">
                {leaderboard.length}
              </div>
              <div className="text-sm text-cyber-blue/70">Jogadores Ativos</div>
            </div>
            
            <div className="p-4 border border-cyber-green/30 rounded bg-cyber-green/5">
              <div className="text-2xl font-bold text-cyber-green">
                {leaderboard.length > 0 ? leaderboard[0]?.total_points.toLocaleString() : 0}
              </div>
              <div className="text-sm text-cyber-green/70">Maior Pontuação</div>
            </div>
            
            <div className="p-4 border border-cyber-pink/30 rounded bg-cyber-pink/5">
              <div className="text-2xl font-bold text-cyber-pink">
                {leaderboard.length > 0 
                  ? Math.round(leaderboard.reduce((sum, p) => sum + p.total_points, 0) / leaderboard.length).toLocaleString()
                  : 0
                }
              </div>
              <div className="text-sm text-cyber-pink/70">Média de Pontos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
