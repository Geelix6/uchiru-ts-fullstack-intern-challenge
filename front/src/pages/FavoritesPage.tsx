import React from 'react';
import { CatGrid } from '@/components/CatGrid';

const FavoritesPage: React.FC = () => {
  const cats = Array.from({ length: 5 }, (_, i) => ({
    id: `cat-${i + 1}`,
    url: 'https://placehold.co/400',
    createdAt: '123',
  }));

  return cats.length === 0 ? (
    <p className="text-center text-gray-400">У вас пока что нет любимых котиков 🐈</p>
  ) : (
    <CatGrid cats={cats} className="mb-12" />
  );
};

export default FavoritesPage;
