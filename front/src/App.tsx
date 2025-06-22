import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import AllCatsPage from './pages/AllCatsPage';
import FavoritesPage from './pages/FavoritesPage';
import clsx from 'clsx';

const App: React.FC = () => {
  return (
    <div className="relative">
      <BrowserRouter>
        <header className="fixed top-0 z-10 h-16 w-full bg-sky-500 shadow-xl">
          <div className="mx-auto h-full max-w-[1440px] px-16">
            <nav className="flex h-full text-sm tracking-wide text-white/70">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  clsx(
                    'flex items-center px-6 transition-colors',
                    isActive ? 'bg-sky-600 text-white' : 'hover:bg-sky-600/70',
                  )
                }
                end
              >
                Все котики
              </NavLink>
              <NavLink
                to="/favorites"
                className={({ isActive }) =>
                  clsx(
                    'flex items-center px-6 transition-colors',
                    isActive ? 'bg-sky-600 text-white' : 'hover:bg-sky-600/70',
                  )
                }
              >
                Любимые
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="mx-auto mt-16 max-w-[1440px] px-16 pt-12">
          <Routes>
            <Route path="/" element={<AllCatsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
};

export default App;
