import React, { useEffect } from 'react';
import { CatGrid } from '@/components/CatGrid';
import { useCatStore } from '@/store/useCatStore';

const AllCatsPage: React.FC = () => {
  const { cats, loadMoreCats, loading } = useCatStore();

  useEffect(() => {
    loadMoreCats();

    // refreshFavorites();
  }, []);

  if (loading && cats.length === 0) {
    return <p className="mb-12 text-center text-sm tracking-wide">... Загружаем котиков ...</p>;
  }

  return (
    <>
      <CatGrid className="mb-12" cats={cats} />

      {loading && (
        <p className="mb-12 text-center text-sm tracking-wide">... Загружаем еще котиков ...</p>
      )}

      {!loading && (
        <div className="my-6 flex justify-center">
          <button
            onClick={loadMoreCats}
            className="rounded-md bg-sky-600 px-4 py-2 text-white transition hover:bg-sky-700"
          >
            Загрузить ещё
          </button>
        </div>
      )}

      {/* {!hasMore && !loading && <p className="mt-4 text-center text-gray-500">Больше нет котиков</p>} */}
    </>
  );
};

export default AllCatsPage;
