function HangmanDisplay({ wrongGuesses }) {
  const stages = [
    // 0 erros
    `
   ╔══════╗
   ║      ║
   ║      
   ║      
   ║      
   ║      
═══╩═══════
    `,
    // 1 erro - cabeça
    `
   ╔══════╗
   ║      ║
   ║      O
   ║      
   ║      
   ║      
═══╩═══════
    `,
    // 2 erros - corpo
    `
   ╔══════╗
   ║      ║
   ║      O
   ║      ║
   ║      
   ║      
═══╩═══════
    `,
    // 3 erros - braço esquerdo
    `
   ╔══════╗
   ║      ║
   ║      O
   ║     /║
   ║      
   ║      
═══╩═══════
    `,
    // 4 erros - braço direito
    `
   ╔══════╗
   ║      ║
   ║      O
   ║     /║\\
   ║      
   ║      
═══╩═══════
    `,
    // 5 erros - perna esquerda
    `
   ╔══════╗
   ║      ║
   ║      O
   ║     /║\\
   ║     / 
   ║      
═══╩═══════
    `,
    // 6 erros - perna direita (game over)
    `
   ╔══════╗
   ║      ║
   ║      O
   ║     /║\\
   ║     / \\
   ║      
═══╩═══════
    `
  ]

  const currentStage = Math.min(wrongGuesses, stages.length - 1)
  
  return (
    <div className="text-center">
      <pre className="hangman-display text-sm md:text-base">
        {stages[currentStage]}
      </pre>
      
      {/* Status indicators */}
      <div className="mt-4 flex justify-center space-x-2">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
              i < wrongGuesses
                ? 'bg-cyber-pink border-cyber-pink animate-pulse'
                : 'border-cyber-blue/30'
            }`}
          />
        ))}
      </div>
      
      {/* Warning messages */}
      {wrongGuesses >= 4 && wrongGuesses < 6 && (
        <div className="mt-3 p-2 border border-cyber-pink bg-cyber-pink/10 rounded text-cyber-pink text-sm animate-pulse">
          ⚠️ ATENÇÃO: Zona de perigo!
        </div>
      )}
      
      {wrongGuesses >= 6 && (
        <div className="mt-3 p-2 border border-cyber-pink bg-cyber-pink/20 rounded text-cyber-pink text-sm animate-flicker">
          💀 MISSÃO FALHOU
        </div>
      )}
    </div>
  )
}

export default HangmanDisplay
