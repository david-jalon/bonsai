import { useEffect, useRef } from 'react'

type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern

interface GridOffset {
  x: number
  y: number
}

interface ShapeGridBackgroundProps {
  direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left'
  speed?: number
  borderColor?: CanvasStrokeStyle
  squareSize?: number
  hoverFillColor?: CanvasStrokeStyle
  shape?: 'square' | 'hexagon' | 'circle' | 'triangle'
  hoverTrailAmount?: number
  className?: string
}

// Tope de densidad: en pantallas 3x (iPhone) dibujar a 2x ya se ve nítido y
// evita triplicar el coste de pintado por frame.
const MAX_DPR = 2

export default function ShapeGridBackground({
  direction = 'right',
  speed = 1,
  borderColor = 'rgba(255, 176, 0, 0.28)',
  squareSize = 40,
  hoverFillColor = 'rgba(255, 176, 0, 0.30)',
  shape = 'square',
  hoverTrailAmount = 0,
  className,
}: ShapeGridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number | null>(null)
  const numSquaresX = useRef<number>(0)
  const numSquaresY = useRef<number>(0)
  const gridOffset = useRef<GridOffset>({ x: 0, y: 0 })
  const hoveredSquareRef = useRef<GridOffset | null>(null)
  const trailCells = useRef<GridOffset[]>([])
  const cellOpacities = useRef<Map<string, number>>(new Map())
  // Tamaño en píxeles CSS. El bitmap puede ser mayor (dpr), pero todo el
  // dibujo se hace en px CSS gracias a ctx.setTransform().
  const viewSize = useRef<GridOffset>({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const debug = new URLSearchParams(window.location.search).has('debug')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const isHex = shape === 'hexagon'
    const isTri = shape === 'triangle'
    const hexHoriz = squareSize * 1.5
    const hexVert = squareSize * Math.sqrt(3)

    const getDpr = () => Math.min(window.devicePixelRatio || 1, MAX_DPR)

    const drawHex = (cx: number, cy: number, size: number) => {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        const vx = cx + size * Math.cos(angle)
        const vy = cy + size * Math.sin(angle)
        if (i === 0) ctx.moveTo(vx, vy)
        else ctx.lineTo(vx, vy)
      }
      ctx.closePath()
    }

    const drawCircle = (cx: number, cy: number, size: number) => {
      ctx.beginPath()
      ctx.arc(cx, cy, size / 2, 0, Math.PI * 2)
      ctx.closePath()
    }

    const drawTriangle = (cx: number, cy: number, size: number, flip: boolean) => {
      ctx.beginPath()
      if (flip) {
        ctx.moveTo(cx, cy + size / 2)
        ctx.lineTo(cx + size / 2, cy - size / 2)
        ctx.lineTo(cx - size / 2, cy - size / 2)
      } else {
        ctx.moveTo(cx, cy - size / 2)
        ctx.lineTo(cx + size / 2, cy + size / 2)
        ctx.lineTo(cx - size / 2, cy + size / 2)
      }
      ctx.closePath()
    }

    const drawDebug = () => {
      const dprReal = window.devicePixelRatio || 1
      const dprUsed = getDpr()
      const w = viewSize.current.x
      const h = viewSize.current.y
      const ratio = canvas.width / (w * dprUsed)

      ctx.fillStyle = 'rgba(13, 17, 23, 0.78)'
      ctx.fillRect(12, 12, 272, 84)
      ctx.strokeStyle = 'rgba(255, 176, 0, 0.55)'
      ctx.lineWidth = 1
      ctx.strokeRect(12.5, 12.5, 271, 83)

      ctx.fillStyle = '#FFB000'
      ctx.font = '12px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx.textBaseline = 'top'
      ctx.fillText(`dpr ${dprReal.toFixed(2)} → ${dprUsed.toFixed(2)}`, 22, 22)
      ctx.fillText(`css ${w}×${h} · bitmap ${canvas.width}×${canvas.height}`, 22, 40)
      ctx.fillText(`ratio ${ratio.toFixed(2)} · celda ${squareSize}px`, 22, 58)
    }

    const drawGrid = () => {
      const w = viewSize.current.x
      const h = viewSize.current.y
      if (w === 0 || h === 0) return

      ctx.clearRect(0, 0, w, h)

      if (isHex) {
        const colShift = Math.floor(gridOffset.current.x / hexHoriz)
        const offsetX = ((gridOffset.current.x % hexHoriz) + hexHoriz) % hexHoriz
        const offsetY = ((gridOffset.current.y % hexVert) + hexVert) % hexVert

        const cols = Math.ceil(w / hexHoriz) + 3
        const rows = Math.ceil(h / hexVert) + 3

        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const cx = col * hexHoriz + offsetX
            const cy = row * hexVert + ((col + colShift) % 2 !== 0 ? hexVert / 2 : 0) + offsetY

            const cellKey = `${col},${row}`
            const alpha = cellOpacities.current.get(cellKey)
            if (alpha) {
              ctx.globalAlpha = alpha
              drawHex(cx, cy, squareSize)
              ctx.fillStyle = hoverFillColor
              ctx.fill()
              ctx.globalAlpha = 1
            }

            drawHex(cx, cy, squareSize)
            ctx.strokeStyle = borderColor
            ctx.stroke()
          }
        }
      } else if (isTri) {
        const halfW = squareSize / 2
        const colShift = Math.floor(gridOffset.current.x / halfW)
        const rowShift = Math.floor(gridOffset.current.y / squareSize)
        const offsetX = ((gridOffset.current.x % halfW) + halfW) % halfW
        const offsetY = ((gridOffset.current.y % squareSize) + squareSize) % squareSize

        const cols = Math.ceil(w / halfW) + 4
        const rows = Math.ceil(h / squareSize) + 4

        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const cx = col * halfW + offsetX
            const cy = row * squareSize + squareSize / 2 + offsetY
            const flip = ((col + colShift + row + rowShift) % 2 + 2) % 2 !== 0

            const cellKey = `${col},${row}`
            const alpha = cellOpacities.current.get(cellKey)
            if (alpha) {
              ctx.globalAlpha = alpha
              drawTriangle(cx, cy, squareSize, flip)
              ctx.fillStyle = hoverFillColor
              ctx.fill()
              ctx.globalAlpha = 1
            }

            drawTriangle(cx, cy, squareSize, flip)
            ctx.strokeStyle = borderColor
            ctx.stroke()
          }
        }
      } else if (shape === 'circle') {
        const offsetX = ((gridOffset.current.x % squareSize) + squareSize) % squareSize
        const offsetY = ((gridOffset.current.y % squareSize) + squareSize) % squareSize

        const cols = Math.ceil(w / squareSize) + 3
        const rows = Math.ceil(h / squareSize) + 3

        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const cx = col * squareSize + squareSize / 2 + offsetX
            const cy = row * squareSize + squareSize / 2 + offsetY

            const cellKey = `${col},${row}`
            const alpha = cellOpacities.current.get(cellKey)
            if (alpha) {
              ctx.globalAlpha = alpha
              drawCircle(cx, cy, squareSize)
              ctx.fillStyle = hoverFillColor
              ctx.fill()
              ctx.globalAlpha = 1
            }

            drawCircle(cx, cy, squareSize)
            ctx.strokeStyle = borderColor
            ctx.stroke()
          }
        }
      } else {
        const offsetX = ((gridOffset.current.x % squareSize) + squareSize) % squareSize
        const offsetY = ((gridOffset.current.y % squareSize) + squareSize) % squareSize

        const cols = Math.ceil(w / squareSize) + 3
        const rows = Math.ceil(h / squareSize) + 3

        for (let col = -2; col < cols; col++) {
          for (let row = -2; row < rows; row++) {
            const sx = col * squareSize + offsetX
            const sy = row * squareSize + offsetY

            const cellKey = `${col},${row}`
            const alpha = cellOpacities.current.get(cellKey)
            if (alpha) {
              ctx.globalAlpha = alpha
              ctx.fillStyle = hoverFillColor
              ctx.fillRect(sx, sy, squareSize, squareSize)
              ctx.globalAlpha = 1
            }

            ctx.strokeStyle = borderColor
            ctx.strokeRect(sx, sy, squareSize, squareSize)
          }
        }
      }

      const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.sqrt(w ** 2 + h ** 2) / 2)
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
      gradient.addColorStop(1, '#0D1117')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, w, h)

      if (debug) drawDebug()
    }

    const resizeCanvas = () => {
      const dpr = getDpr()
      const rect = canvas.getBoundingClientRect()
      const w = Math.max(1, Math.round(rect.width))
      const h = Math.max(1, Math.round(rect.height))
      const bitmapW = Math.round(w * dpr)
      const bitmapH = Math.round(h * dpr)

      // Evita borrar/redibujar si el tamaño no ha cambiado (ResizeObserver
      // puede dispararse varias veces con los mismos valores).
      if (w === viewSize.current.x && h === viewSize.current.y && canvas.width === bitmapW) {
        return
      }

      viewSize.current = { x: w, y: h }
      canvas.width = bitmapW
      canvas.height = bitmapH
      // A partir de aquí se dibuja en px CSS; el navegador escala al bitmap.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      numSquaresX.current = Math.ceil(w / squareSize) + 1
      numSquaresY.current = Math.ceil(h / squareSize) + 1

      if (debug) {
        console.info('[ShapeGridBackground]', {
          dprReal: window.devicePixelRatio,
          dprUsed: dpr,
          css: { w, h },
          bitmap: { w: bitmapW, h: bitmapH },
          bitmapRatio: bitmapW / (w * dpr),
        })
      }

      drawGrid()
    }

    const updateAnimation = () => {
      const effectiveSpeed = Math.max(speed, 0.1)
      const wrapX = isHex ? hexHoriz * 2 : squareSize
      const wrapY = isHex ? hexVert : isTri ? squareSize * 2 : squareSize

      switch (direction) {
        case 'right':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + wrapX) % wrapX
          break
        case 'left':
          gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + wrapX) % wrapX
          break
        case 'up':
          gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + wrapY) % wrapY
          break
        case 'down':
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + wrapY) % wrapY
          break
        case 'diagonal':
          gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + wrapX) % wrapX
          gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + wrapY) % wrapY
          break
        default:
          break
      }

      updateCellOpacities()
      drawGrid()
      requestRef.current = requestAnimationFrame(updateAnimation)
    }

    const updateCellOpacities = () => {
      const targets = new Map<string, number>()

      if (hoveredSquareRef.current) {
        targets.set(`${hoveredSquareRef.current.x},${hoveredSquareRef.current.y}`, 1)
      }

      if (hoverTrailAmount > 0) {
        for (let i = 0; i < trailCells.current.length; i++) {
          const t = trailCells.current[i]
          const key = `${t.x},${t.y}`
          if (!targets.has(key)) {
            targets.set(key, (trailCells.current.length - i) / (trailCells.current.length + 1))
          }
        }
      }

      for (const [key] of targets) {
        if (!cellOpacities.current.has(key)) {
          cellOpacities.current.set(key, 0)
        }
      }

      for (const [key, opacity] of cellOpacities.current) {
        const target = targets.get(key) || 0
        const next = opacity + (target - opacity) * 0.15
        if (next < 0.005) {
          cellOpacities.current.delete(key)
        } else {
          cellOpacities.current.set(key, next)
        }
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top

      if (isHex) {
        const colShift = Math.floor(gridOffset.current.x / hexHoriz)
        const offsetX = ((gridOffset.current.x % hexHoriz) + hexHoriz) % hexHoriz
        const offsetY = ((gridOffset.current.y % hexVert) + hexVert) % hexVert
        const adjustedX = mouseX - offsetX
        const adjustedY = mouseY - offsetY

        const col = Math.round(adjustedX / hexHoriz)
        const rowOffset = (col + colShift) % 2 !== 0 ? hexVert / 2 : 0
        const row = Math.round((adjustedY - rowOffset) / hexVert)

        if (
          !hoveredSquareRef.current ||
          hoveredSquareRef.current.x !== col ||
          hoveredSquareRef.current.y !== row
        ) {
          if (hoveredSquareRef.current && hoverTrailAmount > 0) {
            trailCells.current.unshift({ ...hoveredSquareRef.current })
            if (trailCells.current.length > hoverTrailAmount) trailCells.current.length = hoverTrailAmount
          }
          hoveredSquareRef.current = { x: col, y: row }
        }
      } else if (isTri) {
        const halfW = squareSize / 2
        const offsetX = ((gridOffset.current.x % halfW) + halfW) % halfW
        const offsetY = ((gridOffset.current.y % squareSize) + squareSize) % squareSize

        const adjustedX = mouseX - offsetX
        const adjustedY = mouseY - offsetY

        const col = Math.round(adjustedX / halfW)
        const row = Math.floor(adjustedY / squareSize)

        if (
          !hoveredSquareRef.current ||
          hoveredSquareRef.current.x !== col ||
          hoveredSquareRef.current.y !== row
        ) {
          if (hoveredSquareRef.current && hoverTrailAmount > 0) {
            trailCells.current.unshift({ ...hoveredSquareRef.current })
            if (trailCells.current.length > hoverTrailAmount) trailCells.current.length = hoverTrailAmount
          }
          hoveredSquareRef.current = { x: col, y: row }
        }
      } else if (shape === 'circle') {
        const offsetX = ((gridOffset.current.x % squareSize) + squareSize) % squareSize
        const offsetY = ((gridOffset.current.y % squareSize) + squareSize) % squareSize

        const adjustedX = mouseX - offsetX
        const adjustedY = mouseY - offsetY

        const col = Math.round(adjustedX / squareSize)
        const row = Math.round(adjustedY / squareSize)

        if (
          !hoveredSquareRef.current ||
          hoveredSquareRef.current.x !== col ||
          hoveredSquareRef.current.y !== row
        ) {
          if (hoveredSquareRef.current && hoverTrailAmount > 0) {
            trailCells.current.unshift({ ...hoveredSquareRef.current })
            if (trailCells.current.length > hoverTrailAmount) trailCells.current.length = hoverTrailAmount
          }
          hoveredSquareRef.current = { x: col, y: row }
        }
      } else {
        const offsetX = ((gridOffset.current.x % squareSize) + squareSize) % squareSize
        const offsetY = ((gridOffset.current.y % squareSize) + squareSize) % squareSize

        const adjustedX = mouseX - offsetX
        const adjustedY = mouseY - offsetY

        const col = Math.floor(adjustedX / squareSize)
        const row = Math.floor(adjustedY / squareSize)

        if (
          !hoveredSquareRef.current ||
          hoveredSquareRef.current.x !== col ||
          hoveredSquareRef.current.y !== row
        ) {
          if (hoveredSquareRef.current && hoverTrailAmount > 0) {
            trailCells.current.unshift({ ...hoveredSquareRef.current })
            if (trailCells.current.length > hoverTrailAmount) trailCells.current.length = hoverTrailAmount
          }
          hoveredSquareRef.current = { x: col, y: row }
        }
      }
    }

    const handleMouseLeave = () => {
      if (hoveredSquareRef.current && hoverTrailAmount > 0) {
        trailCells.current.unshift({ ...hoveredSquareRef.current })
        if (trailCells.current.length > hoverTrailAmount) trailCells.current.length = hoverTrailAmount
      }
      hoveredSquareRef.current = null
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    // --- Resincronización del tamaño (antes solo window.resize) ---
    const ro = new ResizeObserver(() => resizeCanvas())
    ro.observe(canvas)
    window.addEventListener('resize', resizeCanvas)
    window.visualViewport?.addEventListener('resize', resizeCanvas)

    // Safari no cambia devicePixelRatio al hacer zoom de página, pero el resto
    // de navegadores sí: reaccionamos a cambios de densidad.
    let dprQuery: MediaQueryList | null = null
    const onDprChange = () => {
      resizeCanvas()
      watchDpr()
    }
    const watchDpr = () => {
      dprQuery?.removeEventListener('change', onDprChange)
      dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`)
      dprQuery.addEventListener('change', onDprChange)
    }
    watchDpr()

    let isVisible = false
    let isPageVisible = !document.hidden

    const tryStart = () => {
      if (reducedMotion) {
        updateCellOpacities()
        drawGrid()
        return
      }
      if (isVisible && isPageVisible && !requestRef.current) {
        requestRef.current = requestAnimationFrame(updateAnimation)
      }
    }
    const tryStop = () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
        requestRef.current = null
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) tryStart()
        else tryStop()
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    const onVisibility = () => {
      isPageVisible = !document.hidden
      if (isPageVisible) tryStart()
      else tryStop()
    }
    document.addEventListener('visibilitychange', onVisibility)

    // Primera medición: ya con drawGrid definido, así no hay frame en blanco.
    resizeCanvas()
    tryStart()

    return () => {
      ro.disconnect()
      window.removeEventListener('resize', resizeCanvas)
      window.visualViewport?.removeEventListener('resize', resizeCanvas)
      dprQuery?.removeEventListener('change', onDprChange)
      tryStop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [direction, speed, borderColor, hoverFillColor, squareSize, shape, hoverTrailAmount])

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />
}
