import { useState, useEffect } from 'react';
import { ShoppingBag, Star, Clock, Zap, Crown, Sparkles } from 'lucide-react';

const POINT_VALUES = {
  BASE_POINTS: 1,
  MAX_MULTIPLIER: 5,
  MULTIPLIER_INCREASE: 0.2,
  PENALTY_POINTS: 1,
  PENALTY_INTERVAL: 5000
};

const TOE_STYLES = {
  basic: {
    name: "Natural Toe",
    price: 0,
    nailGradient: {
      start: "#ffd1dc",
      end: "#ffb6c1"
    },
    description: "Just a regular toe",
    rarity: "common"
  },
  pink: {
    name: "Baby Pink",
    price: 50,
    nailGradient: {
      start: "#ffb6c1",
      end: "#ff69b4"
    },
    description: "Sweet pink polish",
    rarity: "uncommon"
  },
  red: {
    name: "Classic Red",
    price: 75,
    nailGradient: {
      start: "#ff4444",
      end: "#cc0000"
    },
    description: "Timeless red polish",
    rarity: "rare"
  },
  blue: {
    name: "Ocean Blue",
    price: 100,
    nailGradient: {
      start: "#0088ff",
      end: "#0044cc"
    },
    description: "Deep sea vibes",
    rarity: "epic"
  },
  golden: {
    name: "24K Gold",
    price: 1500,
    nailGradient: {
      start: "#ffd700",
      end: "#daa520"
    },
    description: "Pure gold luxury",
    rarity: "legendary"
  }
};

interface RealisticToeProps {
  style: keyof typeof TOE_STYLES;
  isSmashed: boolean;
  multiplier: number;
}

interface BloodDrop {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
  velocity: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

type ToeStyleKey = keyof typeof TOE_STYLES;

const RealisticHammer = () => (
  <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-2xl filter">
    <defs>
      <linearGradient id="woodGradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#5D4037" />
        <stop offset="50%" stopColor="#8D6E63" />
        <stop offset="100%" stopColor="#5D4037" />
      </linearGradient>
      <linearGradient id="metalGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#455A64" />
        <stop offset="30%" stopColor="#90A4AE" />
        <stop offset="60%" stopColor="#CFD8DC" />
        <stop offset="100%" stopColor="#455A64" />
      </linearGradient>
      <filter id="hammerShadow">
        <feDropShadow dx="2" dy="4" stdDeviation="2" floodOpacity="0.5"/>
      </filter>
    </defs>

    {/* Handle */}
    <rect x="90" y="60" width="20" height="130" rx="5" fill="url(#woodGradient)" />

    {/* Head */}
    <rect x="40" y="30" width="120" height="60" rx="5" fill="url(#metalGradient)" filter="url(#hammerShadow)" />

    {/* Shine on head */}
    <path d="M50 40 L150 40 L140 50 L60 50 Z" fill="white" opacity="0.3" />
  </svg>
);

const RealisticToe: React.FC<RealisticToeProps> = ({ style, isSmashed, multiplier }) => {
  const gradientId = `nailGradient-${style}`;
  const rarity = TOE_STYLES[style].rarity;
  
  const getRarityGlow = () => {
    switch(rarity) {
      case 'legendary': return 'drop-shadow(0 0 20px #ffd700) drop-shadow(0 0 40px #ffd700)';
      case 'epic': return 'drop-shadow(0 0 15px #8a2be2) drop-shadow(0 0 30px #8a2be2)';
      case 'rare': return 'drop-shadow(0 0 10px #ff4444) drop-shadow(0 0 20px #ff4444)';
      case 'uncommon': return 'drop-shadow(0 0 8px #32cd32) drop-shadow(0 0 16px #32cd32)';
      default: return 'drop-shadow(0 0 5px #ccc)';
    }
  };
  
  return (
    <div className="relative w-full h-full">
      <svg 
        viewBox="0 0 200 300" 
        className={`w-full h-full transition-all duration-200 ${
          isSmashed ? 'scale-95 rotate-2' : 'scale-100'
        } ${multiplier > 2 ? 'animate-pulse' : ''}`}
        style={{ filter: getRarityGlow() }}
      >
        <defs>
          <linearGradient id="skinGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffdbac"/>
            <stop offset="30%" stopColor="#f1c27d"/>
            <stop offset="70%" stopColor="#e0ac69"/>
            <stop offset="100%" stopColor="#d4a574"/>
          </linearGradient>
          
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={TOE_STYLES[style].nailGradient.start}/>
            <stop offset="50%" stopColor={TOE_STYLES[style].nailGradient.end}/>
            <stop offset="100%" stopColor={TOE_STYLES[style].nailGradient.end}/>
          </linearGradient>
          
          <radialGradient id="nailShine" cx="0.3" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)"/>
            <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
          </radialGradient>
          
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="rgba(0,0,0,0.3)"/>
          </filter>
        </defs>

        <g>
          {/* Main toe body with shadow */}
          <path 
            d="M40 50 C40 30, 160 30, 160 50 L180 200 C180 260, 20 260, 20 200 Z" 
            fill="url(#skinGradient)"
            filter="url(#shadow)"
          />
          
          {/* Toe nail with shine */}
          <path 
            d="M60 40 C60 20, 140 20, 140 40 Q140 60, 100 70 Q60 60, 60 40"
            fill={`url(#${gradientId})`}
            stroke={TOE_STYLES[style].nailGradient.start}
            strokeWidth="2"
          />
          
          {/* Nail shine effect */}
          <path 
            d="M70 25 C70 15, 130 15, 130 25 Q130 35, 100 40 Q70 35, 70 25"
            fill="url(#nailShine)"
            opacity="0.6"
          />
          
          {/* Toe creases with better detail */}
          <path 
            d="M40 120 Q100 130 160 120" 
            fill="none" 
            stroke="#d4a574" 
            strokeWidth="3" 
            opacity="0.4"
          />
          
          <path 
            d="M45 140 Q100 150 155 140" 
            fill="none" 
            stroke="#d4a574" 
            strokeWidth="3" 
            opacity="0.4"
          />
          
          <path 
            d="M50 160 Q100 170 150 160" 
            fill="none" 
            stroke="#d4a574" 
            strokeWidth="2" 
            opacity="0.3"
          />
          
          {/* Toe knuckle detail */}
          <ellipse cx="100" cy="180" rx="15" ry="8" fill="#d4a574" opacity="0.3"/>
          
          {/* Smash effect overlay */}
          {isSmashed && (
            <g>
              <circle cx="100" cy="100" r="80" fill="rgba(255,0,0,0.1)" className="animate-ping"/>
              <path d="M80 80 L120 120 M120 80 L80 120" stroke="red" strokeWidth="3" opacity="0.7"/>
            </g>
          )}
        </g>
      </svg>
      
      {/* Rarity indicator */}
      <div className="absolute top-2 right-2">
        {rarity === 'legendary' && <Crown className="w-6 h-6 text-yellow-500 animate-pulse" />}
        {rarity === 'epic' && <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />}
        {rarity === 'rare' && <Star className="w-6 h-6 text-red-500" />}
        {rarity === 'uncommon' && <Zap className="w-6 h-6 text-green-500" />}
      </div>
    </div>
  );
};

const ToeSmashGame = () => {
  const [score, setScore] = useState(0);
  const [timeUntilPenalty, setTimeUntilPenalty] = useState(POINT_VALUES.PENALTY_INTERVAL);
  const [isActive, setIsActive] = useState(true);
  const [isSmashed, setIsSmashed] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [showShop, setShowShop] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<ToeStyleKey>('basic');
  const [ownedStyles, setOwnedStyles] = useState<ToeStyleKey[]>(['basic']);
  const [bloodDrops, setBloodDrops] = useState<BloodDrop[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showHammer, setShowHammer] = useState(false);
  const [comboCount, setComboCount] = useState(0);
  const [lastSmashTime, setLastSmashTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimeUntilPenalty(prev => {
          if (prev <= 0) {
            setScore(current => Math.max(0, current - POINT_VALUES.PENALTY_POINTS));
            setMultiplier(1);
            setComboCount(0);
            return POINT_VALUES.PENALTY_INTERVAL;
          }
          return prev - 100;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Particle animation
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          life: particle.life - 1,
          vy: particle.vy + 0.1 // gravity
        })).filter(particle => particle.life > 0)
      );
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const createParticleEffect = (x: number, y: number, color: string) => {
    const newParticles = Array(8).fill(0).map((_, i) => ({
      id: Date.now() + i,
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 2,
      life: 30 + Math.random() * 20,
      maxLife: 50,
      color,
      size: 2 + Math.random() * 3
    }));
    setParticles(prev => [...prev, ...newParticles]);
  };

  const createBloodEffect = () => {
    const newDrops = Array(20).fill(0).map((_, i) => ({
      id: Date.now() + i,
      x: 50 + (Math.random() - 0.5) * 100,
      y: 50 + (Math.random() - 0.5) * 100,
      angle: Math.random() * 360,
      scale: 0.3 + Math.random() * 0.7,
      velocity: 1 + Math.random() * 2
    }));
    setBloodDrops((prev: BloodDrop[]) => [...prev, ...newDrops]);
    setTimeout(() => {
      setBloodDrops(prev => prev.filter(drop => !newDrops.includes(drop)));
    }, 2000);
  };

  const handleSmash = () => {
    if (!isActive || isSmashed) return;

    const now = Date.now();
    const timeSinceLastSmash = now - lastSmashTime;
    
    if (timeSinceLastSmash < 1000) {
      setComboCount(prev => prev + 1);
    } else {
      setComboCount(1);
    }
    
    setLastSmashTime(now);

    createBloodEffect();
    createParticleEffect(50, 50, '#ff6b6b');
    setShowHammer(true);
    setIsSmashed(true);

    // Enhanced points calculation with combo bonus
    const comboBonus = Math.min(comboCount * 0.1, 0.5);
    const pointsEarned = Math.floor(POINT_VALUES.BASE_POINTS * multiplier * (1 + comboBonus));
    setScore(prev => prev + pointsEarned);

    setMultiplier(prev => Math.min(prev + POINT_VALUES.MULTIPLIER_INCREASE, POINT_VALUES.MAX_MULTIPLIER));
    setTimeUntilPenalty(POINT_VALUES.PENALTY_INTERVAL);

    setTimeout(() => {
      setIsSmashed(false);
      setShowHammer(false);
    }, 300);
  };

  const purchaseStyle = (style: keyof typeof TOE_STYLES) => {
    if (score >= TOE_STYLES[style].price && !ownedStyles.includes(style)) {
      setScore(prev => prev - TOE_STYLES[style].price);
      setOwnedStyles(prev => [...prev, style]);
      setCurrentStyle(style);
      setShowShop(false);
      
      // Celebration effect
      createParticleEffect(50, 50, '#ffd700');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl">
        {/* Enhanced Score Display */}
        <div className="w-full flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Star className="w-10 h-10 text-yellow-400 drop-shadow-lg" />
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {comboCount}
              </div>
            </div>
            <div className="text-4xl font-bold text-white drop-shadow-lg">
              {Math.floor(score).toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => setShowShop(!showShop)}
            className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ShoppingBag className="w-7 h-7" />
          </button>
        </div>

        {/* Enhanced Timer */}
        <div className="w-full flex items-center gap-3 mb-6">
          <Clock className={`w-6 h-6 ${timeUntilPenalty < 1000 ? 'text-red-400 animate-pulse' : 'text-blue-400'}`} />
          <div className="w-full h-4 bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className={`h-full transition-all duration-100 rounded-full ${
                timeUntilPenalty < 1000 
                  ? 'bg-gradient-to-r from-red-500 to-red-600' 
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500'
              }`}
              style={{ width: `${(timeUntilPenalty / POINT_VALUES.PENALTY_INTERVAL) * 100}%` }}
            />
          </div>
        </div>

        {/* Enhanced Multiplier */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 drop-shadow-lg">
            x{multiplier.toFixed(1)}
          </div>
          {multiplier > 2 && (
            <div className="text-sm text-yellow-300 animate-pulse">
              🔥 COMBO MODE! 🔥
            </div>
          )}
        </div>

        {/* Enhanced Game Area */}
        <div className="relative w-80 h-96 mx-auto mb-6">
          <button
            onClick={handleSmash}
            disabled={!isActive || isSmashed}
            className="w-full h-full relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-3xl backdrop-blur-sm border border-white/30 group-hover:border-white/50 transition-all duration-200" />
            
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              <RealisticToe style={currentStyle} isSmashed={isSmashed} multiplier={multiplier} />
            </div>
            
            {/* Blood drops with enhanced animation */}
            {bloodDrops.map(drop => (
              <div
                key={drop.id}
                className="absolute w-3 h-3 bg-gradient-to-br from-red-600 to-red-800 rounded-full animate-bounce"
                style={{
                  left: `${drop.x}%`,
                  top: `${drop.y}%`,
                  transform: `rotate(${drop.angle}deg) scale(${drop.scale})`,
                  animationDuration: `${drop.velocity}s`,
                }}
              />
            ))}

            {/* Particles */}
            {particles.map(particle => (
              <div
                key={particle.id}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  backgroundColor: particle.color,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  opacity: particle.life / particle.maxLife,
                }}
              />
            ))}

            {/* Enhanced hammer effect */}
            {showHammer && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 origin-bottom z-20 pointer-events-none">
                <div className="animate-smash drop-shadow-2xl">
                  <RealisticHammer />
                </div>
              </div>
            )}
          </button>
        </div>

        {/* Enhanced Shop Modal */}
        {showShop && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 max-w-2xl w-full border border-white/20 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">✨ Toe Shop ✨</h2>
                <button 
                  onClick={() => setShowShop(false)} 
                  className="text-gray-400 hover:text-white text-2xl transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {Object.entries(TOE_STYLES).map(([id, item]) => (
                  <div key={id} className="p-6 border border-white/20 rounded-2xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-200">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-white text-lg">{item.name}</h3>
                          {item.rarity === 'legendary' && <Crown className="w-5 h-5 text-yellow-500" />}
                          {item.rarity === 'epic' && <Sparkles className="w-5 h-5 text-purple-500" />}
                          {item.rarity === 'rare' && <Star className="w-5 h-5 text-red-500" />}
                          {item.rarity === 'uncommon' && <Zap className="w-5 h-5 text-green-500" />}
                        </div>
                        <p className="text-sm text-gray-300">{item.description}</p>
                      </div>
                      {ownedStyles.includes(id as ToeStyleKey) ? (
                        <button
                          onClick={() => {
                            setCurrentStyle(id as ToeStyleKey);
                            setShowShop(false);
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 font-bold"
                        >
                          Use
                        </button>
                      ) : (
                        <button
                          onClick={() => purchaseStyle(id as ToeStyleKey)}
                          disabled={score < item.price}
                          className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                            score >= item.price
                              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transform hover:scale-105'
                              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {item.price} pts
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Reset Button */}
        <div className="text-center">
          <button
            onClick={() => {
              setIsActive(true);
              setScore(0);
              setMultiplier(1);
              setComboCount(0);
              setTimeUntilPenalty(POINT_VALUES.PENALTY_INTERVAL);
            }}
            className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 text-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🔄 Reset Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToeSmashGame;