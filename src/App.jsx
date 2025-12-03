import { useState } from 'react'
import { OptionsTable } from './components/OptionsTable.jsx'
import { Tablero } from './components/Tablero.jsx'
import {HeaderPage} from './sections/HeaderPage.jsx'

function App() {
  const [gameMode, setGameMode] = useState(null)
  const [showBoard, setShowBoard] = useState(false)

  const handleStartGame = (mode) => {
    setGameMode(mode)
    setShowBoard(true)
  }

  const handleBackToMenu = () => {
    setShowBoard(false)
    setGameMode(null)
  }

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <HeaderPage />
      {!showBoard ? (
        <OptionsTable onStartGame={handleStartGame} />
      ) : (
        <Tablero mode={gameMode} onBackToMenu={handleBackToMenu} />
      )}
    </div>
  )
}

export default App
