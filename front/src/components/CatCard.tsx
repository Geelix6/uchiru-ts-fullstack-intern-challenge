import React, { useState } from 'react';
import clsx from 'clsx';
import { CatResponseDto } from '@/dto/CatResponseDto';
import OutlinedHeartIcon from './icons/OutlinedHeartIcon';
import FilledHeartIcon from './icons/FilledHeartIcon';

type CatCardProps = Pick<CatResponseDto, 'id' | 'url'>;

export const CatCard: React.FC<CatCardProps> = ({ id, url }) => {
  const [hoverButton, setHoverButton] = useState(false);

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
      >
        {hoverButton ? <FilledHeartIcon /> : <OutlinedHeartIcon />}
      </button>
    </div>
  );
};
