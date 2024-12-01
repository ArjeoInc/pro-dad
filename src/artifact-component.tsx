import { useState } from 'react';
import { Star, Heart, Trophy, ThumbsUp, Sparkles, Crown } from 'lucide-react';

const activities = [
  { id: 1, name: "Ice Skating Adventure", description: "Took the girls ice skating" },
  { id: 2, name: "Movie Time", description: "Watched '3 Dads and a Little Lady' together" },
  { id: 3, name: "Master Chef", description: "Made delicious pancakes from scratch" },
  { id: 4, name: "Jaffa Tour", description: "Fun visits to Cassis Cafe and Gemma Restaurant" },
  { id: 5, name: "Lunch Box Hero", description: "Prepared yummy school lunches with veggies" },
  { id: 6, name: "Punctuality Pro", description: "Got everyone to school on time!" }
];

const kids = ["Nathalie", "Lana", "Mila"];

interface Ratings {
  [key: number]: number;
}

interface AnimatingStars {
  [key: number]: boolean;
}

const SuperDadRating = () => {
  const [ratings, setRatings] = useState<Ratings>({});
  const [comments, setComments] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [animatingStars, setAnimatingStars] = useState<AnimatingStars>({});
  const [selectedKid, setSelectedKid] = useState("");
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);

  const handleRating = (activityId: number, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [activityId]: rating
    }));
    
    setAnimatingStars(prev => ({
      ...prev,
      [activityId]: true
    }));
    
    setTimeout(() => {
      setAnimatingStars(prev => ({
        ...prev,
        [activityId]: false
      }));
    }, 1000);
  };

  const calculateAverageRating = () => {
    const values = Object.values(ratings);
    return values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : 0;
  };

  interface StarRatingProps {
    activityId: number;
    rating?: number;
  }

  const StarRating = ({ activityId }: StarRatingProps) => {
    return (
      <div className="flex space-x-1 relative">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full opacity-0 group-hover:opacity-75 blur transition-all duration-300" />
            <Star
              size={24}
              className={`
                relative cursor-pointer transition-all duration-300
                hover:scale-150 hover:rotate-[360deg]
                active:scale-150 active:rotate-[720deg]
                group-hover:drop-shadow-lg
                ${(ratings[activityId] || 0) >= star
                  ? 'fill-yellow-400 stroke-yellow-400 hover:fill-orange-400 hover:stroke-orange-400'
                  : 'stroke-gray-300 hover:stroke-pink-300 hover:fill-pink-100'
                }
                ${animatingStars[activityId] ? 'animate-bounce' : ''}
              `}
              onMouseEnter={() => setHoveredStar(`${activityId}-${star}`)}
              onMouseLeave={() => setHoveredStar(null)}
              onClick={(e) => {
                e.stopPropagation();
                handleRating(activityId, star);
              }}
            />
            {hoveredStar === `${activityId}-${star}` && (
              <Sparkles 
                size={32}
                className="absolute -top-4 -right-4 text-yellow-400 animate-spin"
              />
            )}
            {(ratings[activityId] || 0) >= star && (
              <Sparkles 
                size={16}
                className={`
                  absolute -top-2 -right-2 text-yellow-400
                  animate-spin
                  ${animatingStars[activityId] ? 'opacity-100' : 'opacity-0'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-xl shadow-lg">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-transparent bg-clip-text hover:scale-105 transition-transform cursor-pointer">
          Super Dad Weekend Rating
          <Trophy className="inline-block ml-2 text-yellow-500 animate-bounce" />
        </h1>
        
        <select
          value={selectedKid}
          onChange={(e) => setSelectedKid(e.target.value)}
          className="px-4 py-2 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 bg-white text-purple-700 font-semibold cursor-pointer hover:bg-purple-50 transition-colors"
        >
          <option value="">Choose who's rating Dad...</option>
          {kids.map(kid => (
            <option key={kid} value={kid}>{kid}</option>
          ))}
        </select>
        
        {selectedKid && (
          <p className="text-purple-600 font-medium animate-fade-in">
            Hi {selectedKid}! Let's show Mom how awesome Dad was! 
            <Crown className="inline-block ml-2 text-yellow-500" />
          </p>
        )}
      </div>

      <div className="grid gap-4">
        {activities.map((activity) => (
          <div 
            key={activity.id}
            className="p-4 rounded-lg bg-white hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-purple-700 group-hover:text-indigo-600 transition-colors">{activity.name}</h3>
                <p className="text-sm text-gray-600">{activity.description}</p>
              </div>
              <StarRating activityId={activity.id} rating={ratings[activity.id]} />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <textarea
          className="w-full p-3 rounded-lg border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          placeholder={`Add a special message for Mom about Dad's weekend...`}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={3}
        />

        <button
          onClick={() => setSubmitted(true)}
          disabled={!selectedKid || Object.keys(ratings).length === 0}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold 
            hover:from-purple-500 hover:to-indigo-500 hover:scale-105 
            disabled:opacity-50 disabled:cursor-not-allowed 
            transition-all duration-300
            active:scale-95"
        >
          Submit {selectedKid}'s Ratings
        </button>
      </div>

      {submitted && (
        <div className="mt-6 p-6 bg-white rounded-lg shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">
              {selectedKid}'s Report Card
            </h2>
            <div className="flex items-center space-x-2">
              <Trophy className="text-yellow-500 animate-spin" />
              <span className="text-2xl font-bold text-yellow-500 animate-pulse">
                {calculateAverageRating()}/5
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Heart className="text-pink-500 animate-bounce" />
            <p className="text-gray-700 italic">"{comments}"</p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <ThumbsUp className="text-green-500 animate-bounce" size={32} />
            <Sparkles className="text-yellow-500 animate-spin" size={32} />
            <Trophy className="text-orange-500 animate-pulse" size={32} />
            <Crown className="text-purple-500 animate-bounce" size={32} />
          </div>
          
          <p className="text-center text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text animate-pulse">
            Dad's Weekend Score: AMAZING! 🏆
          </p>
        </div>
      )}
    </div>
  );
};

export default SuperDadRating;