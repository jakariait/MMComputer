import { create } from 'zustand';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const useBrandStore = create((set) => ({
  brands: [],
  loading: false,
  error: null,

  fetchBrands: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${apiUrl}/brands`);
      if (response.data.success && response.data.data) {
        set({ brands: response.data.data, loading: false });
      } else {
        throw new Error('Brands not found in the response');
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      set({
        error: error.response?.data?.message || 'Failed to fetch brands',
        loading: false,
      });
    }
  },
}));

export default useBrandStore;
