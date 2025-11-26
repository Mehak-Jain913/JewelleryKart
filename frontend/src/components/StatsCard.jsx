const StatsCard = ({ title, value, icon, gradient = "from-[#D4AF37] to-[#B08B3A]" }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">{title}</p>
          <p className="text-3xl font-bold text-black font-display">{value}</p>
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

export default StatsCard


