import { create } from 'zustand';
import { listLikes, newUser, dropLike, addLike } from '@/api/backendApi';
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
  toggleLike: (cat: CatDto) => Promise<void>;
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

    const token = localStorage.getItem('cat-pinterest-auth-token')!;
    try {
      const likes = await listLikes(token);
      const likedIds = new Set(likes.map((l) => l.cat_id));
      const newItems = await fetchCats();
      const newCats: CatDto[] = newItems.map((cat) => ({
        id: cat.id,
        url: cat.url,
        isLiked: likedIds.has(cat.id),
      }));
      set({ cats: [...cats, ...newCats] });
    } catch (err) {
      console.error('loadMoreCats error', err);
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
      const favoriteCats: CatDto[] = likes.map((like) => ({
        id: like.cat_id,
        url: like.cat_url,
        isLiked: true,
      }));
      set({ favoriteCats });
    } catch (err) {
      console.error('refreshFavorites error', err);
    } finally {
      set({ loading: false });
    }
  },

  toggleLike: async (cat: CatDto) => {
    const { favoriteCats, cats } = get();

    const token = localStorage.getItem('cat-pinterest-auth-token')!;
    try {
      if (cat.isLiked) {
        await dropLike(token, cat.id);
        set({
          favoriteCats: favoriteCats.filter((c) => c.id !== cat.id),
        });
      } else {
        await addLike(token, { cat_id: cat.id, cat_url: cat.url });
        set({ favoriteCats: [...favoriteCats, { ...cat, isLiked: true }] });
      }

      set({ cats: cats.map((c) => (c.id === cat.id ? { ...c, isLiked: !c.isLiked } : c)) });
    } catch (err) {
      console.error('toggleLike error', err);
    }
  },
}));
