/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react"

export const Timer = ({ isRunning, reset }) => {
  const [time, setTime] = useState(0)

  useEffect(() => {
    let timer
    if (isRunning) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isRunning])

  useEffect(() => {
    if (reset) {
      setTime(0)
    }
  }, [reset])

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center gap-2 text-lg font-semibold text-gray-200">
      <span className="text-2xl">⏱️</span>
      <span>Tiempo: <span className="text-violet-400 font-mono">{formatTime(time)}</span></span>
    </div>
  )
}