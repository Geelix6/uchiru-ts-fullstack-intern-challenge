import { create } from 'zustand';
import { listLikes, newUser } from '@/api/backendApi';
import { fetchCats } from '@/api/catApi';
import { CatDto } from '@/dto/CatDto';

type CatStore = {
  cats: CatDto[];
  favoriteCats: CatDto[];
  authChecked: boolean;
  loading: boolean;

  initAuth: () => Promise<void>;
  loadMoreCats: () => Promise<void>;
  refreshFavorites: () => Promise<void>;
  // toggleFavorite: (cat: CatDto) => Promise<void>;
};

export const useCatStore = create<CatStore>((set, get) => ({
  cats: [],
  favoriteCats: [],
  authChecked: false,
  loading: false,

  initAuth: async () => {
    const existing = localStorage.getItem('cat-pinterest-auth-token');
    if (existing) {
      set({ authChecked: true });
    } else {
      const login = `demo-user-${Math.random().toString(36).slice(2)}`;
      const password = 'demo_password';
      try {
        const token = await newUser(login, password);
        localStorage.setItem('cat-pinterest-auth-token', token);
        set({ authChecked: true });
      } catch (err) {
        console.error('Auth init failed', err);
      }
    }
  },

  loadMoreCats: async () => {
    const { loading, cats } = get();
    if (loading) return;
    set({ loading: true });
    try {
      const newCats = await fetchCats();
      set({ cats: [...cats, ...newCats] });
    } finally {
      set({ loading: false });
    }
  },

  refreshFavorites: async () => {
    const { loading } = get();
    if (loading) return;
    set({ loading: true });

    const token = localStorage.getItem('cat-pinterest-auth-token')!;
    try {
      const likes = await listLikes(token);
      const favSet = new Set<string>();
      const favCats = likes.map((l) => {
        favSet.add(l.cat_id);
        return { id: l.cat_id, url: l.cat_url } as CatDto;
      });
      set({ favoriteCats: favCats });
    } catch (err) {
      console.error('refreshFavorites error', err);
    } finally {
      set({ loading: false });
    }
  },

  // toggleFavorite: async (cat) => {
  //   const token = localStorage.getItem('cat-pinterest-auth-token')!;
  //   const favs = new Set(get().favorites);
  //   const favCats = [...get().favoriteCats];
  //   if (favs.has(cat.id)) {
  //     await dropLike(token, cat.id);
  //     favs.delete(cat.id);
  //     const idx = favCats.findIndex((c) => c.id === cat.id);
  //     if (idx !== -1) favCats.splice(idx, 1);
  //   } else {
  //     await addLike(token, { cat_id: cat.id, cat_url: cat.url });
  //     favs.add(cat.id);
  //     favCats.push(cat);
  //   }
  //   set({ favorites: favs, favoriteCats: favCats });
  // },
}));
