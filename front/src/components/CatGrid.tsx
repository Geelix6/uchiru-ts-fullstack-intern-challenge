import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CatResponseDto } from '@/dto/CatResponseDto';
import { CatCard } from './CatCard';

type CatGridProps = {
  cats: CatResponseDto[];
  className?: string;
};

export const CatGrid: React.FC<CatGridProps> = ({ cats, className }) => {
  return (
    <div
      className={twMerge(
        clsx(className, 'grid grid-cols-2 gap-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'),
      )}
    >
      {cats.map((cat) => (
        <CatCard key={cat.id} id={cat.id} url={cat.url} />
      ))}
    </div>
  );
};
