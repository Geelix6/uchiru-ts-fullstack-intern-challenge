import React, { useState } from 'react';
import clsx from 'clsx';
import { CatDto } from '@/dto/CatDto';
import OutlinedHeartIcon from './icons/OutlinedHeartIcon';
import FilledHeartIcon from './icons/FilledHeartIcon';

interface CatCardProps extends CatDto {
  onToggle: () => Promise<void>;
}

export const CatCard: React.FC<CatCardProps> = ({ id, url, isLiked, onToggle }) => {
  const [hoverButton, setHoverButton] = useState(false);

  const [loading, setLoading] = useState(false);
  const [justToggled, setJustToggled] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onToggle();
      setJustToggled(true);
      setTimeout(() => setJustToggled(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const showFilled = hoverButton || isLiked;

  return (
    <div className="group relative aspect-square transition-all duration-300 hover:scale-115 hover:shadow-lg">
      <img src={url} alt={`Cat ${id} image`} className="h-full w-full object-cover" />

      <button
        className={clsx(
          'absolute right-6 bottom-6 cursor-pointer',
          'opacity-0 transition-opacity duration-200 group-hover:opacity-100',
        )}
        onMouseEnter={() => setHoverButton(true)}
        onMouseLeave={() => setHoverButton(false)}
        onClick={handleClick}
        disabled={loading}
      >
        <div className={clsx(loading && 'opacity-75', justToggled && 'animate-bounce')}>
          {showFilled ? <FilledHeartIcon /> : <OutlinedHeartIcon />}
        </div>
      </button>
    </div>
  );
};
