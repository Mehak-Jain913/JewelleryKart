import { useEffect, useRef } from 'react'

const SalesChart = ({ monthlySales }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current || !monthlySales || monthlySales.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    const maxValue = Math.max(...monthlySales, 1)
    const barWidth = width / monthlySales.length
    const padding = 10

    // Draw grid lines
    ctx.strokeStyle = '#E5E7EB'
    ctx.lineWidth = 1
    for (let i = 0; i <= 5; i++) {
      const y = (height / 5) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Draw bars
    monthlySales.forEach((value, index) => {
      const barHeight = (value / maxValue) * (height - 40)
      const x = index * barWidth + padding
      const y = height - barHeight - 20

      // Gold gradient
      const gradient = ctx.createLinearGradient(0, y, 0, height - 20)
      gradient.addColorStop(0, '#D4AF37')
      gradient.addColorStop(1, '#B08B3A')

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth - padding * 2, barHeight)

      // Value label
      ctx.fillStyle = '#000000'
      ctx.font = '12px Poppins'
      ctx.textAlign = 'center'
      ctx.fillText(
        `$${value.toFixed(0)}`,
        x + (barWidth - padding * 2) / 2,
        y - 5
      )
    })
  }, [monthlySales])

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-xl font-bold text-black mb-4 font-display">Monthly Sales</h3>
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="w-full h-auto"
        />
        {(!monthlySales || monthlySales.length === 0) && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            No sales data available
          </div>
        )}
      </div>
    </div>
  )
}

export default SalesChart


