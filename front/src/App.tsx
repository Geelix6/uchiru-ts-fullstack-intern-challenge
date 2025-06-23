import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import LoadingSpinnerIcon from './components/icons/LoadingSpinnerIcon';
import AllCatsPage from './pages/AllCatsPage';
import FavoritesPage from './pages/FavoritesPage';
import { useCatStore } from './store/useCatStore';

const App: React.FC = () => {
  const initAuth = useCatStore((state) => state.initAuth);
  const authChecked = useCatStore((state) => state.authChecked);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <header className="fixed top-0 z-10 h-16 w-full bg-sky-500 shadow-xl">
        <div className="mx-auto h-full max-w-[1440px] px-16">
          <nav className="flex h-full text-sm tracking-wide text-white/70">
            {['/', '/favorites'].map((to, idx) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center px-6 transition-colors',
                    isActive ? 'bg-sky-600 text-white' : 'hover:bg-sky-600/70',
                  )
                }
              >
                {idx === 0 ? 'Все котики' : 'Любимые'}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto mt-16 max-w-[1440px] px-16 pt-12">
        {!authChecked ? (
          <div className="flex justify-center" role="status">
            <LoadingSpinnerIcon />
            <span className="sr-only">Загрузка...</span>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<AllCatsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        )}
      </main>
    </BrowserRouter>
  );
};

export default App;
