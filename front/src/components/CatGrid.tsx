import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CatDto } from '@/dto/CatDto';
import { CatCard } from './CatCard';

type CatGridProps = {
  cats: CatDto[];
  className?: string;
};

export const CatGrid: React.FC<CatGridProps> = ({ cats, className }) => {
  return (
    <div
      className={twMerge(
        clsx(className, 'grid grid-cols-2 gap-12 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'),
      )}
    >
      {cats.map((cat, idx) => (
        <CatCard key={idx} id={cat.id} url={cat.url} />
      ))}
    </div>
  );
};
