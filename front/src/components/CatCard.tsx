import React from 'react';
import clsx from 'clsx';
import { CatResponseDto } from '@/dto/CatResponseDto';
import OutlinedHeartIcon from './icons/OutlinedHeartIcon';
import FilledHeartIcon from './icons/FilledHeartIcon';

type CatCardProps = Pick<CatResponseDto, 'id' | 'url'>;

export const CatCard: React.FC<CatCardProps> = ({ id, url }) => (
  <div className="group relative transition-all duration-300 hover:scale-115 hover:shadow-lg">
    <img src={url} alt={`Cat ${id} image`} className="h-full w-full object-cover" />

    <button
      className={clsx(
        'absolute right-6 bottom-6 cursor-pointer',
        'opacity-0 transition-opacity duration-200 group-hover:opacity-100',
      )}
    >
      {Math.random() > 0.5 ? <OutlinedHeartIcon /> : <FilledHeartIcon />}
    </button>
  </div>
);
