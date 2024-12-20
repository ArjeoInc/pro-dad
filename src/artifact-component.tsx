import { useState, useEffect } from 'react';
import { ShoppingBag, Star, Clock } from 'lucide-react';

const POINT_VALUES = {
  BASE_POINTS: 1,
  MAX_MULTIPLIER: 3,
  MULTIPLIER_INCREASE: 0.1,
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
    description: "Just a regular toe"
  },
  pink: {
    name: "Baby Pink",
    price: 50,
    nailGradient: {
      start: "#ffb6c1",
      end: "#ff69b4"
    },
    description: "Sweet pink polish"
  },
  red: {
    name: "Classic Red",
    price: 75,
    nailGradient: {
      start: "#ff4444",
      end: "#cc0000"
    },
    description: "Timeless red polish"
  },
  blue: {
    name: "Ocean Blue",
    price: 100,
    nailGradient: {
      start: "#0088ff",
      end: "#0044cc"
    },
    description: "Deep sea vibes"
  },
  golden: {
    name: "24K Gold",
    price: 1500,
    nailGradient: {
      start: "#ffd700",
      end: "#daa520"
    },
    description: "Pure gold luxury"
  }
};

interface RealisticToeProps {
  style: keyof typeof TOE_STYLES;
  isSmashed: boolean;
}

interface BloodDrop {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
}

type ToeStyleKey = keyof typeof TOE_STYLES;

const RealisticToe: React.FC<RealisticToeProps> = ({ style, isSmashed }) => {
  const gradientId = `nailGradient-${style}`;
  
  return (
    <svg 
      viewBox="0 0 200 300" 
      className={`w-full h-full transition-transform duration-150 ${isSmashed ? 'scale-95' : ''}`}
    >
      <defs>
        <linearGradient id="skinGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffdbac"/>
          <stop offset="50%" stopColor="#f1c27d"/>
          <stop offset="100%" stopColor="#e0ac69"/>
        </linearGradient>
        
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TOE_STYLES[style].nailGradient.start}/>
          <stop offset="100%" stopColor={TOE_STYLES[style].nailGradient.end}/>
        </linearGradient>
      </defs>

      <g>
        <path 
          d="M40 50 C40 30, 160 30, 160 50 L180 200 C180 260, 20 260, 20 200 Z" 
          fill="url(#skinGradient)"
        />
        
        <path 
          d="M60 40 C60 20, 140 20, 140 40 Q140 60, 100 70 Q60 60, 60 40"
          fill={`url(#${gradientId})`}
          stroke={TOE_STYLES[style].nailGradient.start}
          strokeWidth="1"
        />
        
        <path 
          d="M40 120 Q100 130 160 120" 
          fill="none" 
          stroke="#e0ac69" 
          strokeWidth="2" 
          opacity="0.3"
        />
        
        <path 
          d="M45 140 Q100 150 155 140" 
          fill="none" 
          stroke="#e0ac69" 
          strokeWidth="2" 
          opacity="0.3"
        />
      </g>
    </svg>
  );
};

const ToeSmashGame = () => {
  const [score, setScore] = useState(0);
  const [timeUntilPenalty, setTimeUntilPenalty] = useState(POINT_VALUES.PENALTY_INTERVAL);
  const [isActive, setIsActive] = useState(false);
  const [isSmashed, setIsSmashed] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [showShop, setShowShop] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<ToeStyleKey>('basic');
  const [ownedStyles, setOwnedStyles] = useState<ToeStyleKey[]>(['basic']);
  const [bloodDrops, setBloodDrops] = useState<BloodDrop[]>([]);
  const [showHammer, setShowHammer] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimeUntilPenalty(prev => {
          if (prev <= 0) {
            setScore(current => Math.max(0, current - POINT_VALUES.PENALTY_POINTS));
            setMultiplier(1);
            return POINT_VALUES.PENALTY_INTERVAL;
          }
          return prev - 100;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const createBloodEffect = () => {
    const newDrops = Array(15).fill(0).map((_, i) => ({
      id: Date.now() + i,
      x: 50 + (Math.random() - 0.5) * 80,
      y: 50 + (Math.random() - 0.5) * 80,
      angle: Math.random() * 360,
      scale: 0.5 + Math.random()
    }));
    setBloodDrops((prev: BloodDrop[]) => [...prev, ...newDrops]);
    setTimeout(() => {
      setBloodDrops(prev => prev.filter(drop => !newDrops.includes(drop)));
    }, 1000);
  };

  const handleSmash = () => {
    if (!isActive || isSmashed) return;

    createBloodEffect();
    setShowHammer(true);
    setIsSmashed(true);

    // Integer points calculation
    const pointsEarned = Math.floor(POINT_VALUES.BASE_POINTS * multiplier);
    setScore(prev => prev + pointsEarned);

    setMultiplier(prev => Math.min(prev + POINT_VALUES.MULTIPLIER_INCREASE, POINT_VALUES.MAX_MULTIPLIER));
    setTimeUntilPenalty(POINT_VALUES.PENALTY_INTERVAL);

    setTimeout(() => {
      setIsSmashed(false);
      setShowHammer(false);
    }, 200);
  };

  const purchaseStyle = (style: keyof typeof TOE_STYLES) => {
    if (score >= TOE_STYLES[style].price && !ownedStyles.includes(style)) {
      setScore(prev => prev - TOE_STYLES[style].price);
      setOwnedStyles(prev => [...prev, style]);
      setCurrentStyle(style);
      setShowShop(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-gray-50 rounded-xl max-w-xl mx-auto">
      {/* Score Display */}
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2 text-3xl font-bold">
          <Star className="w-8 h-8 text-yellow-500" />
          <span>{Math.floor(score)}</span>
        </div>
        <button
          onClick={() => setShowShop(!showShop)}
          className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          <ShoppingBag className="w-6 h-6" />
        </button>
      </div>

      {/* Timer */}
      <div className="w-full flex items-center gap-2">
        <Clock className={timeUntilPenalty < 1000 ? 'text-red-500' : 'text-blue-500'} />
        <div className="w-full h-3 bg-gray-200 rounded-full">
          <div
            className={`h-full transition-all duration-100 ${
              timeUntilPenalty < 1000 ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${(timeUntilPenalty / POINT_VALUES.PENALTY_INTERVAL) * 100}%` }}
          />
        </div>
      </div>

      {/* Multiplier */}
      <div className="text-xl font-bold text-purple-500">
        x{Math.floor(multiplier)}
      </div>

      {/* Game Area */}
      <div className="relative w-64 h-96">
        <button
          onClick={handleSmash}
          disabled={!isActive || isSmashed}
          className="w-full h-full relative"
        >
          <RealisticToe style={currentStyle} isSmashed={isSmashed} />
          
          {bloodDrops.map(drop => (
            <div
              key={drop.id}
              className="absolute w-2 h-2 bg-red-600 rounded-full animate-drip"
              style={{
                left: `${drop.x}%`,
                top: `${drop.y}%`,
                transform: `rotate(${drop.angle}deg) scale(${drop.scale})`,
              }}
            />
          ))}

          {showHammer && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 origin-bottom">
              <div className="text-7xl animate-smash">
                🔨
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Shop Modal */}
      {showShop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Toe Shop</h2>
              <button onClick={() => setShowShop(false)} className="text-gray-500">✕</button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(TOE_STYLES).map(([id, item]) => (
                <div key={id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    {ownedStyles.includes(id as ToeStyleKey) ? (
                      <button
                        onClick={() => {
                          setCurrentStyle(id as ToeStyleKey);
                          setShowShop(false);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Use
                      </button>
                    ) : (
                      <button
                        onClick={() => purchaseStyle(id as ToeStyleKey)}
                        disabled={score < item.price}
                        className={`px-4 py-2 rounded-lg ${
                          score >= item.price
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-gray-200 text-gray-500'
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

      {/* Start Button */}
      <button
        onClick={() => {
          setIsActive(true);
          setScore(0);
          setMultiplier(1);
          setTimeUntilPenalty(POINT_VALUES.PENALTY_INTERVAL);
        }}
        className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-xl font-bold"
      >
        {isActive ? 'Reset Game' : 'Start Game'}
      </button>
    </div>
  );
};

export default ToeSmashGame;