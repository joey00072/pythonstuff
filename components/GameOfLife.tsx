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
  speed = 5,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const lastUpdateRef = useRef<number>(0)
  const generationRef = useRef<number>(0)
  const [dimensions, setDimensions] = useState({ width, height })
  const [isDarkMode, setIsDarkMode] = useState(false)

  const cols = Math.floor(dimensions.width / cellSize)
  const rows = Math.floor(dimensions.height / cellSize)

  // Initialize grid with gliders from top and bottom
  const createGrid = useCallback(() => {
    const grid = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(0))

    // Add downward-moving gliders randomly in first 50 rows
    const numDownGliders = Math.floor(cols / 40) // Further reduced: roughly one glider per 40 columns
    const downGliderPositions: { col: number; row: number }[] = []

    for (let i = 0; i < numDownGliders; i++) {
      let attempts = 0
      let placed = false

      while (!placed && attempts < 50) {
        const col = Math.floor(Math.random() * (cols - 10)) + 3
        const row = Math.floor(Math.random() * Math.min(50, rows - 3))

        // Check distance from other gliders (minimum 15 cells apart)
        const tooClose = downGliderPositions.some(
          (pos) => Math.abs(pos.col - col) < 15 || Math.abs(pos.row - row) < 4
        )

        if (!tooClose && col + 2 < cols && row + 2 < rows) {
          // Downward-moving glider pattern
          grid[row][col + 1] = 1
          grid[row + 1][col + 2] = 1
          grid[row + 2][col] = 1
          grid[row + 2][col + 1] = 1
          grid[row + 2][col + 2] = 1

          downGliderPositions.push({ col, row })
          placed = true
        }
        attempts++
      }
    }

    // Add upward-moving gliders randomly in last 50 rows
    const numUpGliders = Math.floor(cols / 40) // Further reduced
    const upGliderPositions: { col: number; row: number }[] = []

    for (let i = 0; i < numUpGliders; i++) {
      let attempts = 0
      let placed = false

      while (!placed && attempts < 50) {
        const col = Math.floor(Math.random() * (cols - 10)) + 3
        const row =
          Math.max(rows - 50, 2) +
          Math.floor(Math.random() * Math.min(50, rows - Math.max(rows - 50, 2) - 3))

        // Check distance from other gliders (minimum 15 cells apart)
        const tooClose = upGliderPositions.some(
          (pos) => Math.abs(pos.col - col) < 15 || Math.abs(pos.row - row) < 4
        )

        if (!tooClose && col + 2 < cols && row + 2 < rows) {
          // Upward-moving glider pattern (flipped)
          grid[row + 2][col + 1] = 1
          grid[row + 1][col] = 1
          grid[row][col] = 1
          grid[row][col + 1] = 1
          grid[row][col + 2] = 1

          upGliderPositions.push({ col, row })
          placed = true
        }
        attempts++
      }
    }

    // Add rightward-moving gliders from left side
    const numRightGliders = Math.floor(rows / 60) // Further reduced
    const rightGliderPositions: { col: number; row: number }[] = []

    for (let i = 0; i < numRightGliders; i++) {
      let attempts = 0
      let placed = false

      while (!placed && attempts < 50) {
        const col = Math.floor(Math.random() * Math.min(15, cols - 10)) + 3
        const row = Math.floor(Math.random() * (rows - 10)) + 5

        // Check distance from other gliders (minimum 15 cells apart)
        const tooClose = rightGliderPositions.some(
          (pos) => Math.abs(pos.col - col) < 4 || Math.abs(pos.row - row) < 15
        )

        if (!tooClose && col + 2 < cols && row + 1 < rows && row - 1 >= 0) {
          // Rightward-moving glider pattern
          grid[row - 1][col] = 1
          grid[row][col + 1] = 1
          grid[row + 1][col - 1] = 1
          grid[row + 1][col] = 1
          grid[row + 1][col + 1] = 1

          rightGliderPositions.push({ col, row })
          placed = true
        }
        attempts++
      }
    }

    // Add leftward-moving gliders from right side
    const numLeftGliders = Math.floor(rows / 60) // Further reduced
    const leftGliderPositions: { col: number; row: number }[] = []

    for (let i = 0; i < numLeftGliders; i++) {
      let attempts = 0
      let placed = false

      while (!placed && attempts < 50) {
        const col =
          Math.max(cols - 15, 10) +
          Math.floor(Math.random() * Math.min(15, cols - Math.max(cols - 15, 10) - 3))
        const row = Math.floor(Math.random() * (rows - 10)) + 5

        // Check distance from other gliders (minimum 15 cells apart)
        const tooClose = leftGliderPositions.some(
          (pos) => Math.abs(pos.col - col) < 4 || Math.abs(pos.row - row) < 15
        )

        if (!tooClose && col - 2 >= 0 && row + 1 < rows && row - 1 >= 0) {
          // Leftward-moving glider pattern
          grid[row - 1][col] = 1
          grid[row][col - 1] = 1
          grid[row + 1][col + 1] = 1
          grid[row + 1][col] = 1
          grid[row + 1][col - 1] = 1

          leftGliderPositions.push({ col, row })
          placed = true
        }
        attempts++
      }
    }

    // Add stable blocks in the middle
    // Removed static blocks for cleaner animation

    // Add fewer beehive patterns (also stable) around the center
    // Removed beehive patterns for cleaner animation

    return grid
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
      generationRef.current += 1

      let newGrid = currentGrid.map((row, y) =>
        row.map((cell, x) => {
          const neighbors = countNeighbors(currentGrid, x, y)
          if (cell === 1) {
            return neighbors === 2 || neighbors === 3 ? 1 : 0
          } else {
            return neighbors === 3 ? 1 : 0
          }
        })
      )

      // Add new gliders randomly every 200 generations (reduced frequency)
      if (generationRef.current % 200 === 0) {
        // Create a downward-moving glider in random top area
        const topRow = Math.floor(Math.random() * Math.min(20, rows - 3)) + 3
        const topCol = Math.floor(Math.random() * Math.min(30, cols - 3)) + 3

        if (topRow + 2 < rows && topCol + 2 < cols) {
          newGrid[topRow][topCol + 1] = 1
          newGrid[topRow + 1][topCol + 2] = 1
          newGrid[topRow + 2][topCol] = 1
          newGrid[topRow + 2][topCol + 1] = 1
          newGrid[topRow + 2][topCol + 2] = 1
        }

        // Create an upward-moving glider in random bottom area
        const bottomRow =
          Math.max(rows - 20, 5) +
          Math.floor(Math.random() * Math.min(20, rows - Math.max(rows - 20, 5) - 3))
        const bottomCol =
          Math.max(cols - 30, 5) +
          Math.floor(Math.random() * Math.min(30, cols - Math.max(cols - 30, 5) - 3))

        if (bottomRow - 2 >= 0 && bottomCol - 2 >= 0 && bottomRow < rows && bottomCol < cols) {
          newGrid[bottomRow - 2][bottomCol - 1] = 1
          newGrid[bottomRow - 1][bottomCol - 2] = 1
          newGrid[bottomRow][bottomCol - 2] = 1
          newGrid[bottomRow][bottomCol - 1] = 1
          newGrid[bottomRow][bottomCol] = 1
        }
      }

      return newGrid
    },
    [countNeighbors, rows, cols]
  )

  // Draw the grid
  const draw = useCallback(
    (grid: number[][]) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Use lighter color and higher opacity in dark mode
      const color = isDarkMode ? `rgba(229, 231, 235, ${opacity * 1.2})` : `rgba(59, 130, 246, ${opacity})` // Light gray in dark mode, blue in light mode

      ctx.clearRect(0, 0, dimensions.width, dimensions.height)
      ctx.fillStyle = color

      grid.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell === 1) {
            ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1)
          }
        })
      })
    },
    [dimensions.width, dimensions.height, cellSize, opacity, isDarkMode]
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

  // Check initial dark mode state and listen for theme changes
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    }

    checkDarkMode()

    // Listen for theme changes
    // eslint-disable-next-line no-undef
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    return () => observer.disconnect()
  }, [])

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

  // Redraw when theme changes
  useEffect(() => {
    draw(grid)
  }, [isDarkMode, draw, grid])

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
