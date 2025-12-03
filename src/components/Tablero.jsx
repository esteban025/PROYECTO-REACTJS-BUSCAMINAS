/* eslint-disable react-hooks/exhaustive-deps */
 
import { useState, useEffect } from 'react'
import minaImg from '../assets/mina.webp'
import { Timer } from './Timer'

export const Tablero = ({ mode, onBackToMenu }) => {
  const [board, setBoard] = useState([])
  const [revealed, setRevealed] = useState([])
  const [flagged, setFlagged] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerReset, setTimerReset] = useState(false)
  const [firstClick, setFirstClick] = useState(false)

  // Reiniciar el juego con el mismo modo
  const handleRestart = () => {
    setBoard(createBoard())
    setRevealed([])
    setFlagged([])
    setGameOver(false)
    setGameWon(false)
    setTimerRunning(false)
    setFirstClick(false)
    setTimerReset(true)
    setTimeout(() => setTimerReset(false), 0)
  }
  
  let rows = 0
  let cols = 0
  let mines = 0

  switch (mode) {
    case 'easy':
      rows = 8
      cols = 8
      mines = 10
      break;
    case 'medium':
      rows = 16
      cols = 16
      mines = 40
      break;
    case 'hard':
      rows = 24
      cols = 24
      mines = 99
      break;
    default:
      rows = 8
      cols = 8
      mines = 10
      break;
  }

  const totalCells = rows * cols

  // Crear el tablero con minas
  const createBoard = () => {
    const newBoard = Array(totalCells).fill(0)
    
    // Colocar minas aleatoriamente
    const minePositions = new Set()
    while (minePositions.size < mines) {
      const randomPos = Math.floor(Math.random() * totalCells)
      minePositions.add(randomPos)
    }
    
    // Marcar celdas con minas como -1
    minePositions.forEach(pos => {
      newBoard[pos] = -1
    })
    
    // Calcular números adyacentes
    for (let i = 0; i < totalCells; i++) {
      if (newBoard[i] === -1) continue
      
      const row = Math.floor(i / cols)
      const col = i % cols
      let count = 0
      
      // Revisar las 8 celdas adyacentes
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue
          
          const newRow = row + dr
          const newCol = col + dc
          
          if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            const newIndex = newRow * cols + newCol
            if (newBoard[newIndex] === -1) count++
          }
        }
      }
      
      newBoard[i] = count
    }
    
    return newBoard
  }

  // Inicializar el tablero cuando cambie el modo
  useEffect(() => {
    setBoard(createBoard())
    setRevealed([])
    setFlagged([])
    setGameOver(false)
    setGameWon(false)
    setTimerRunning(false)
    setFirstClick(false)
    setTimerReset(true)
    setTimeout(() => setTimerReset(false), 0)
  }, [mode])

  // Revelar celda
  const revealCell = (index) => {
    if (gameOver || gameWon || revealed.includes(index) || flagged.includes(index)) return
    
    // Iniciar timer en el primer click
    if (!firstClick) {
      setTimerRunning(true)
      setFirstClick(true)
    }
    
    // Si es mina, game over
    if (board[index] === -1) {
      setGameOver(true)
      setTimerRunning(false)
      setRevealed([...Array(totalCells).keys()]) // Revelar todo
      return
    }
    
    const newRevealed = [...revealed, index]
    
    // Si es 0, revelar celdas adyacentes recursivamente
    if (board[index] === 0) {
      const toReveal = []
      const queue = [index]
      const visited = new Set(revealed)
      
      while (queue.length > 0) {
        const current = queue.shift()
        if (visited.has(current)) continue
        
        visited.add(current)
        toReveal.push(current)
        
        const row = Math.floor(current / cols)
        const col = current % cols
        
        // Si la celda actual es 0, agregar adyacentes
        if (board[current] === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              if (dr === 0 && dc === 0) continue
              
              const newRow = row + dr
              const newCol = col + dc
              
              if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                const newIndex = newRow * cols + newCol
                if (!visited.has(newIndex) && !flagged.includes(newIndex)) {
                  queue.push(newIndex)
                }
              }
            }
          }
        }
      }
      
      setRevealed([...new Set([...revealed, ...toReveal])])
    } else {
      setRevealed(newRevealed)
    }
    
    // Verificar si ganó
    if (newRevealed.length === totalCells - mines) {
      setGameWon(true)
      setTimerRunning(false)
    }
  }

  // Marcar/desmarcar bandera
  const toggleFlag = (index, e) => {
    e.preventDefault()
    if (gameOver || gameWon || revealed.includes(index)) return
    
    if (flagged.includes(index)) {
      setFlagged(flagged.filter(i => i !== index))
    } else {
      setFlagged([...flagged, index])
    }
  }

  // Obtener contenido de celda
  const getCellContent = (index) => {
    if (flagged.includes(index)) return '🚩'
    if (!revealed.includes(index)) return ''
    if (board[index] === -1) return null // Retornar null para minas
    if (board[index] === 0) return ''
    return board[index]
  }

  // Obtener color según el número
  const getNumberColor = (num) => {
    const colors = {
      1: 'text-blue-600',
      2: 'text-green-600',
      3: 'text-red-600',
      4: 'text-purple-700',
      5: 'text-orange-700',
      6: 'text-teal-600',
      7: 'text-black',
      8: 'text-gray-700'
    }
    return colors[num] || 'text-gray-800'
  }

  // Obtener clase de celda
  const getCellClass = (index) => {
    let baseClass = 'celda rounded aspect-square flex justify-center items-center cursor-pointer font-bold select-none transition-all duration-200 overflow-hidden'
    
    if (revealed.includes(index)) {
      if (board[index] === -1) {
        return `${baseClass} bg-red-500 text-white shadow-inner`
      }
      return `${baseClass} bg-gradient-to-br from-gray-200 to-gray-300 ${getNumberColor(board[index])} shadow-inner border border-gray-400`
    }
    
    if (flagged.includes(index)) {
      return `${baseClass} bg-gradient-to-br from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 shadow-md active:shadow-inner`
    }
    
    return `${baseClass} bg-gradient-to-br from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 shadow-md active:shadow-inner hover:scale-105`
  }

  return (
    <div className="flex flex-col gap-6 items-center w-full p-4">
      {/* Panel de información superior */}
      <div className="flex flex-col gap-4 items-center bg-linear-to-br from-neutral-800 to-neutral-900 p-6 rounded-xl shadow-2xl border-2 border-neutral-700 min-w-[300px]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-200">
            <span className="text-2xl">🚩</span>
            <span>Banderas: <span className="text-violet-400">{flagged.length}</span> / {mines}</span>
          </div>
          <Timer isRunning={timerRunning} reset={timerReset} />
        </div>
        
        {gameOver && (
          <>
            <div className="text-2xl font-bold text-red-400 animate-pulse flex items-center gap-2">
              <span className="text-3xl">💥</span>
              ¡Perdiste!
            </div>
            <div className="flex items-center gap-3">
              <button className="btn btn-primary" onClick={handleRestart}>
                Reintentar
              </button>
              <button className="btn btn-secondary" onClick={onBackToMenu}>
                Cambiar modo
              </button>
            </div>
          </>
        )}
        {gameWon && (
          <>
            <div className="text-2xl font-bold text-green-400 animate-pulse flex items-center gap-2">
              <span className="text-3xl">🎉</span>
              ¡Ganaste!
            </div>
            <div className="flex items-center gap-3">
              <button className="btn btn-primary" onClick={handleRestart}>
                Jugar de nuevo
              </button>
              <button className="btn btn-secondary" onClick={onBackToMenu}>
                Cambiar modo
              </button>
            </div>
          </>
        )}
      </div>

      {/* Tablero de juego */}
      <div 
        className="tablero grid bg-linear-to-br from-neutral-800 to-neutral-900 p-3 rounded-xl gap-1 shadow-2xl border-4 border-neutral-700 w-full max-w-[95vw]" 
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          maxWidth: mode === 'easy' ? 'min(95vw, 450px)' : mode === 'medium' ? 'min(95vw, 650px)' : 'min(95vw, 850px)'
        }}
      >
        {board.map((_, index) => (
          <div 
            key={index} 
            className={getCellClass(index)}
            onClick={() => revealCell(index)}
            onContextMenu={(e) => toggleFlag(index, e)}
          >
            {revealed.includes(index) && board[index] === -1 ? (
              <img 
                src={minaImg} 
                alt="mina" 
                className="w-3/4 h-3/4 object-contain"
              />
            ) : (
              <span className={`leading-none ${revealed.includes(index) && board[index] !== -1 ? 'text-base' : 'text-lg'}`}>
                {getCellContent(index)}
              </span>
            )}
          </div>
        ))}
          </div>
      </div>
  )
}