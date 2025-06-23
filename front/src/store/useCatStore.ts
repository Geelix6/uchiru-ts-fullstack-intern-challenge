import { create } from 'zustand';
import { toast } from 'react-toastify';
import { listLikes, newUser, dropLike, addLike } from '@/api/backendApi';
import { fetchCats } from '@/api/catApi';
import { CatDto } from '@/dto/CatDto';

type CatStore = {
  cats: CatDto[];
  favoriteCats: CatDto[];
  authChecked: boolean;
  loading: boolean;
  hasMore: boolean;

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
  hasMore: true,

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
      } catch (err: any) {
        toast.error(`Ошибка авторизации: ${err.message || err}`);
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
      set({ cats: [...cats, ...newCats], hasMore: newCats.length > 0 });
    } catch (err: any) {
      toast.error(`Не удалось загрузить котиков: ${err.message || err}`);
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
    } catch (err: any) {
      toast.error(`Не удалось загрузить избранное: ${err.message || err}`);
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
    } catch (err: any) {
      toast.error(`Ошибка при обновлении лайка: ${err.message || err}`);
    }
  },
}));
