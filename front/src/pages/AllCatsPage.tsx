import React, { useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CatGrid } from '@/components/CatGrid';
import { useCatStore } from '@/store/useCatStore';

const AllCatsPage: React.FC = () => {
  const { cats, loadMoreCats, toggleLike, loading, hasMore } = useCatStore();

  useEffect(() => {
    if (cats.length === 0) {
      loadMoreCats();
    }
  }, [cats.length, loadMoreCats]);

  if (loading && cats.length === 0) {
    return <p className="mb-12 text-center text-sm tracking-wide">... Загружаем котиков ...</p>;
  }

  return (
    <InfiniteScroll
      className="overflow-visible!"
      dataLength={cats.length}
      next={loadMoreCats}
      hasMore={hasMore}
      loader={
        <p className="mb-12 text-center text-sm tracking-wide">... Загружаем еще котиков ...</p>
      }
      endMessage={
        <p className="mb-12 text-center text-sm tracking-wide">Котики закончились... 😿</p>
      }
    >
      <CatGrid
        className="mb-12"
        cats={cats}
        onToggle={(cat) => {
          return toggleLike(cat);
        }}
      />
    </InfiniteScroll>
  );
};

export default AllCatsPage;
