import React from 'react';
import { CatGrid } from '@/components/CatGrid';

const AllCatsPage: React.FC = () => {
  const cats = Array.from({ length: 20 }, (_, i) => ({
    id: `cat-${i + 1}`,
    url: 'https://placehold.co/400',
    createdAt: '123',
  }));

  return (
    <>
      <CatGrid cats={cats} className="mb-12" />
      <p className="mb-12 text-center text-sm tracking-wide">... загружаем еще котиков ...</p>
    </>
  );
};

export default AllCatsPage;
