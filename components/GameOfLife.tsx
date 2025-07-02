'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'

interface GameOfLifeProps {
  width?: number
  height?: number
  cellSize?: number
  opacity?: number
  speed?: number
  className?: string
}

const GameOfLife: React.FC<GameOfLifeProps> = ({
  width = 800,
  height = 600,
  cellSize = 8,
  opacity = 0.1,
  speed = 200,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const lastUpdateRef = useRef<number>(0)
  const [dimensions, setDimensions] = useState({ width, height })

  const cols = Math.floor(dimensions.width / cellSize)
  const rows = Math.floor(dimensions.height / cellSize)

  // Initialize grid with random pattern
  const createGrid = useCallback(() => {
    return Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => (Math.random() > 0.7 ? 1 : 0))
      )
  }, [rows, cols])

  const [grid, setGrid] = useState(() => createGrid())

  // Count live neighbors
  const countNeighbors = useCallback(
    (grid: number[][], x: number, y: number) => {
      let count = 0
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (i === 0 && j === 0) continue
          const row = (y + i + rows) % rows
          const col = (x + j + cols) % cols
          count += grid[row][col]
        }
      }
      return count
    },
    [rows, cols]
  )

  // Apply Game of Life rules
  const nextGeneration = useCallback(
    (currentGrid: number[][]) => {
      return currentGrid.map((row, y) =>
        row.map((cell, x) => {
          const neighbors = countNeighbors(currentGrid, x, y)
          if (cell === 1) {
            return neighbors === 2 || neighbors === 3 ? 1 : 0
          } else {
            return neighbors === 3 ? 1 : 0
          }
        })
      )
    },
    [countNeighbors]
  )

  // Draw the grid
  const draw = useCallback(
    (grid: number[][]) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.clearRect(0, 0, dimensions.width, dimensions.height)
      ctx.fillStyle = `rgba(59, 130, 246, ${opacity})` // Blue color with opacity

      grid.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell === 1) {
            ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1)
          }
        })
      })
    },
    [dimensions.width, dimensions.height, cellSize, opacity]
  )

  // Animation loop
  const animate = useCallback(
    (currentTime: number) => {
      if (currentTime - lastUpdateRef.current >= speed) {
        setGrid((currentGrid) => {
          const newGrid = nextGeneration(currentGrid)
          draw(newGrid)
          return newGrid
        })
        lastUpdateRef.current = currentTime
      }
      animationFrameRef.current = requestAnimationFrame(animate)
    },
    [speed, nextGeneration, draw]
  )

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Start animation
  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [animate])

  // Regenerate grid when dimensions change
  useEffect(() => {
    setGrid(createGrid())
  }, [createGrid])

  // Initial draw
  useEffect(() => {
    draw(grid)
  }, [grid, draw])

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      className={`fixed inset-0 -z-10 ${className}`}
      style={{
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
    />
  )
}

export default GameOfLife
