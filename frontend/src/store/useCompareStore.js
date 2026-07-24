// src/store/useCompareStore.js
import { create } from 'zustand';

const useCompareStore = create((set) => ({
  compareList: JSON.parse(localStorage.getItem('compareList')) || [],

  addToCompare: (product) =>
    set((state) => {
      if (state.compareList.some((p) => p._id === product._id)) return state;
      const updated = [...state.compareList, product];
      localStorage.setItem('compareList', JSON.stringify(updated));
      return { compareList: updated };
    }),

  removeFromCompare: (id) =>
    set((state) => {
      const updated = state.compareList.filter((p) => p._id !== id);
      localStorage.setItem('compareList', JSON.stringify(updated));
      return { compareList: updated };
    }),

  clearCompare: () => {
    localStorage.removeItem('compareList');
    set({ compareList: [] });
  },
}));

export default useCompareStore;
