import { useState, useEffect, Suspense } from 'react';
import { ShoppingBag, Star, Clock, Zap, Crown, Sparkles, AlertTriangle } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { Toe3D, Hammer3D, BloodParticles } from './Game3D';

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
    description: "Just a regular toe",
    rarity: "common"
  },
  pink: {
    name: "Baby Pink",
    price: 50,
    description: "Sweet pink polish",
    rarity: "uncommon"
  },
  red: {
    name: "Classic Red",
    price: 75,
    description: "Timeless red polish",
    rarity: "rare"
  },
  blue: {
    name: "Ocean Blue",
    price: 100,
    description: "Deep sea vibes",
    rarity: "epic"
  },
  golden: {
    name: "24K Gold",
    price: 1500,
    description: "Pure gold luxury",
    rarity: "legendary"
  }
};

type ToeStyleKey = keyof typeof TOE_STYLES;

const ToeSmashGame = () => {
  const [score, setScore] = useState(0);
  const [timeUntilPenalty, setTimeUntilPenalty] = useState(POINT_VALUES.PENALTY_INTERVAL);
  const [isActive, setIsActive] = useState(true);
  const [isSmashed, setIsSmashed] = useState(false);
  const [multiplier, setMultiplier] = useState(1);
  const [showShop, setShowShop] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<ToeStyleKey>('basic');
  const [ownedStyles, setOwnedStyles] = useState<ToeStyleKey[]>(['basic']);
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex flex-col items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 max-w-3xl w-full border border-white/10 shadow-2xl relative overflow-hidden">

        {/* Background Glow */}
        <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl pointer-events-none" />

        {/* Enhanced Score Display */}
        <div className="w-full flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Star className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
              <div className="absolute -top-2 -right-2 bg-red-600 text-white text-sm rounded-full w-6 h-6 flex items-center justify-center font-bold border border-white/20">
                {comboCount}
              </div>
            </div>
            <div className="text-5xl font-black text-white drop-shadow-lg tracking-tight">
              {Math.floor(score).toLocaleString()}
            </div>
          </div>
          <button
            onClick={() => setShowShop(!showShop)}
            className="p-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-2xl hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-200 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transform hover:scale-105 border border-white/10"
          >
            <ShoppingBag className="w-6 h-6" />
          </button>
        </div>

        {/* Enhanced Timer */}
        <div className="w-full flex items-center gap-4 mb-8 relative z-10">
          <Clock className={`w-6 h-6 ${timeUntilPenalty < 1000 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`} />
          <div className="w-full h-3 bg-gray-800/50 rounded-full overflow-hidden backdrop-blur-sm ring-1 ring-white/10">
            <div
              className={`h-full transition-all duration-100 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)] ${
                timeUntilPenalty < 1000 
                  ? 'bg-gradient-to-r from-red-500 to-rose-600'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600'
              }`}
              style={{ width: `${(timeUntilPenalty / POINT_VALUES.PENALTY_INTERVAL) * 100}%` }}
            />
          </div>
        </div>

        {/* Enhanced Multiplier */}
        <div className="text-center mb-4 relative z-10 min-h-[40px]">
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500 drop-shadow-sm">
            x{multiplier.toFixed(1)}
          </div>
          {multiplier > 2 && (
            <div className="text-sm font-bold text-yellow-300 animate-pulse mt-1 tracking-wider">
              🔥 RAMPAGE MODE! 🔥
            </div>
          )}
        </div>

        {/* 3D Game Area */}
        <div className="relative w-full h-[500px] mb-6 rounded-2xl overflow-hidden border border-white/5 bg-black/20 shadow-inner">
          <button
            onClick={handleSmash}
            disabled={!isActive || isSmashed}
            className="absolute inset-0 w-full h-full cursor-crosshair z-20 focus:outline-none"
            aria-label="Smash Toe"
          />
            
          <Canvas shadows camera={{ position: [0, 2, 8], fov: 45 }}>
            <Suspense fallback={null}>
              <Environment preset="studio" />
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} shadow-mapSize={2048} castShadow />

              <group position={[0, -1, 0]}>
                  <Toe3D style={currentStyle} isSmashed={isSmashed} multiplier={multiplier} />
                  <Hammer3D isSmashing={showHammer} />
                  <BloodParticles active={isSmashed} />
                  <ContactShadows resolution={1024} scale={10} blur={1} opacity={0.5} far={10} color="#000000" />
              </group>

              {/* Simple orbit controls for debugging, can remove if we want fixed camera */}
              {/* <OrbitControls enableZoom={false} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} /> */}
            </Suspense>
          </Canvas>

          {/* Overlay Flash on Smash */}
          {isSmashed && (
              <div className="absolute inset-0 bg-red-500/20 animate-pulse pointer-events-none z-10 mix-blend-overlay" />
          )}
        </div>

        {/* Enhanced Shop Modal */}
        {showShop && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-3xl p-8 max-w-2xl w-full border border-white/10 shadow-2xl ring-1 ring-white/20">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  ✨ Toe Shop
                </h2>
                <button 
                  onClick={() => setShowShop(false)} 
                  className="text-gray-400 hover:text-white text-2xl transition-colors p-2 hover:bg-white/10 rounded-full"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {Object.entries(TOE_STYLES).map(([id, item]) => (
                  <div key={id} className="p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-200 group">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-white text-lg group-hover:text-purple-300 transition-colors">{item.name}</h3>
                          {item.rarity === 'legendary' && <Crown className="w-5 h-5 text-yellow-500 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]" />}
                          {item.rarity === 'epic' && <Sparkles className="w-5 h-5 text-purple-500 drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]" />}
                          {item.rarity === 'rare' && <Star className="w-5 h-5 text-red-500" />}
                          {item.rarity === 'uncommon' && <Zap className="w-5 h-5 text-green-500" />}
                        </div>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                      {ownedStyles.includes(id as ToeStyleKey) ? (
                        <button
                          onClick={() => {
                            setCurrentStyle(id as ToeStyleKey);
                            setShowShop(false);
                          }}
                          className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                              currentStyle === id
                              ? 'bg-green-500/20 text-green-400 border border-green-500/50 cursor-default'
                              : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-500 hover:to-cyan-500 shadow-lg'
                          }`}
                        >
                          {currentStyle === id ? 'Equipped' : 'Equip'}
                        </button>
                      ) : (
                        <button
                          onClick={() => purchaseStyle(id as ToeStyleKey)}
                          disabled={score < item.price}
                          className={`px-6 py-3 rounded-xl font-bold transition-all duration-200 ${
                            score >= item.price
                              ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-500 hover:to-green-500 shadow-lg transform hover:scale-105'
                              : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
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
            className="px-10 py-4 bg-gradient-to-r from-red-900/50 to-red-800/50 text-red-200 border border-red-500/30 rounded-2xl hover:bg-red-900/80 hover:border-red-500/50 text-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 mx-auto group"
          >
            <AlertTriangle className="w-5 h-5 group-hover:animate-bounce" />
            Reset Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToeSmashGame;