import React from 'react';
import { getStarArray } from '../utils/formatters';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, reviewCount, size = 14 }) => {
  const stars = getStarArray(rating);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {stars.map((type, i) => (
          <Star
            key={i}
            size={size}
            className={
              type === 'full'
                ? 'fill-[#c5a880] text-[#c5a880]'
                : type === 'half'
                ? 'fill-[#c5a880]/50 text-[#c5a880]'
                : 'fill-none text-gray-300 dark:text-gray-600'
            }
          />
        ))}
      </div>
      {reviewCount !== undefined && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </div>
  );
};

export default StarRating;
