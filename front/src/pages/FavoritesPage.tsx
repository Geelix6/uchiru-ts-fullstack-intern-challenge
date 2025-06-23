import React, { useEffect } from 'react';
import { CatGrid } from '@/components/CatGrid';
import { useCatStore } from '@/store/useCatStore';

const FavoritesPage: React.FC = () => {
  const { favoriteCats, refreshFavorites, loading } = useCatStore();

  useEffect(() => {
    refreshFavorites();
  }, []);

  if (loading) {
    return <p className="text-center text-sm tracking-wide">... Загружаем любимых котиков ...</p>;
  }

  if (favoriteCats.length === 0) {
    return (
      <p className="text-center text-sm tracking-wide">У вас пока что нет любимых котиков 🐈</p>
    );
  }

  return <CatGrid cats={favoriteCats} className="mb-12" />;
};

export default FavoritesPage;
