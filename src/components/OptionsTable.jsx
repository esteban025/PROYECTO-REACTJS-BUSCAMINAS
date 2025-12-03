import { useState } from 'react'

export const OptionsTable = ({ onStartGame }) => {
  const [selectedMode, setSelectedMode] = useState('')

  const handleStart = () => {
    if (selectedMode) {
      onStartGame(selectedMode)
    }
  }
  
  return (
    <div className="options flex flex-col justify-center items-center gap-8">
      <h2 className="text-xl font-semibold">Selecciona un modo de juego</h2>

      <div className="ops" id="select-wrapper">
        <select 
          className="p-3 rounded-lg border-2 border-border-select focus:outline-none focus:border-violet-600 focus:shadow-inputs transition-all duration-200 space-y-2 cursor-pointer" 
          name="selec-table" 
          id="selec-table"
          value={selectedMode}
          onChange={(e) => setSelectedMode(e.target.value)}
        >
          <option value="" disabled>Modo</option>
          <option value="easy">Fácil (8x8, 10 minas)</option>
          <option value="medium">Medio (16x16, 40 minas)</option>
          <option value="hard">Difícil (24x24, 99 minas)</option>
        </select>
      </div>
      <div className="flex items-center gap-4">
        <button 
          className="btn btn-primary" 
          onClick={handleStart}
          disabled={!selectedMode}
        >
          Comenzar
        </button>
      </div>
    </div>
  )
}