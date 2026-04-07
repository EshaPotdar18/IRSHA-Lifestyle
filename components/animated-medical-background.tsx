"use client"

export default function AnimatedMedicalBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated SVG Medical Symbols */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
        <defs>
          <style>{`
            @keyframes float1 {
              0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
              50% { transform: translateY(-20px) rotate(5deg); opacity: 0.6; }
            }
            @keyframes float2 {
              0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.35; }
              50% { transform: translateY(-25px) rotate(-8deg); opacity: 0.5; }
            }
            @keyframes float3 {
              0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
              50% { transform: translateY(-15px) rotate(3deg); opacity: 0.55; }
            }
            @keyframes pulse-glow {
              0%, 100% { r: 45px; filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.3)); }
              50% { r: 50px; filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.5)); }
            }
            .heart { animation: float1 6s ease-in-out infinite; }
            .stethoscope { animation: float2 7s ease-in-out infinite; }
            .pills { animation: float3 8s ease-in-out infinite; }
            .cross { animation: float1 9s ease-in-out infinite; }
            .pulse { animation: pulse-glow 3s ease-in-out infinite; }
          `}</style>
        </defs>

        {/* Heart Symbols */}
        <g className="heart" transform="translate(150, 200)">
          <path
            d="M0,-15 C-8,-23 -20,-23 -20,-10 C-20,5 0,20 0,20 C0,20 20,5 20,-10 C20,-23 8,-23 0,-15 Z"
            fill="#ef4444"
            opacity="0.7"
          />
        </g>

        <g className="heart" transform="translate(900, 350)">
          <path
            d="M0,-15 C-8,-23 -20,-23 -20,-10 C-20,5 0,20 0,20 C0,20 20,5 20,-10 C20,-23 8,-23 0,-15 Z"
            fill="#ef4444"
            opacity="0.6"
          />
        </g>

        {/* Stethoscope Symbols */}
        <g className="stethoscope" transform="translate(250, 500)">
          <circle cx="0" cy="0" r="8" fill="#3b82f6" opacity="0.7" />
          <path d="M-15,-5 Q-10,-15 0,-15 Q10,-15 15,-5" stroke="#3b82f6" strokeWidth="3" fill="none" opacity="0.6" />
          <circle cx="-15" cy="5" r="6" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.6" />
          <circle cx="15" cy="5" r="6" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.6" />
        </g>

        <g className="stethoscope" transform="translate(1050, 200)">
          <circle cx="0" cy="0" r="8" fill="#3b82f6" opacity="0.6" />
          <path d="M-15,-5 Q-10,-15 0,-15 Q10,-15 15,-5" stroke="#3b82f6" strokeWidth="3" fill="none" opacity="0.5" />
          <circle cx="-15" cy="5" r="6" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />
          <circle cx="15" cy="5" r="6" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.5" />
        </g>

        {/* Medicine Pills */}
        <g className="pills" transform="translate(700, 150)">
          <rect x="-8" y="-5" width="16" height="10" rx="5" fill="#a855f7" opacity="0.7" />
          <circle cx="-4" cy="0" r="4" fill="#c084fc" opacity="0.8" />
        </g>

        <g className="pills" transform="translate(350, 350)">
          <rect x="-8" y="-5" width="16" height="10" rx="5" fill="#a855f7" opacity="0.6" />
          <circle cx="-4" cy="0" r="4" fill="#c084fc" opacity="0.7" />
        </g>

        {/* Medical Cross Symbols */}
        <g className="cross" transform="translate(550, 250)">
          <rect x="-3" y="-12" width="6" height="24" fill="#10b981" opacity="0.7" />
          <rect x="-12" y="-3" width="24" height="6" fill="#10b981" opacity="0.7" />
        </g>

        <g className="cross" transform="translate(800, 600)">
          <rect x="-3" y="-12" width="6" height="24" fill="#10b981" opacity="0.6" />
          <rect x="-12" y="-3" width="24" height="6" fill="#10b981" opacity="0.6" />
        </g>

        {/* Additional Small Decorative Dots */}
        <circle cx="200" cy="100" r="4" fill="#06b6d4" opacity="0.3" />
        <circle cx="950" cy="500" r="3" fill="#06b6d4" opacity="0.35" />
        <circle cx="400" cy="650" r="3.5" fill="#ec4899" opacity="0.3" />
        <circle cx="750" cy="700" r="4" fill="#f59e0b" opacity="0.32" />
      </svg>

      {/* Optional: Gradient Overlay for Better Form Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-white/20 pointer-events-none" />
    </div>
  )
}
