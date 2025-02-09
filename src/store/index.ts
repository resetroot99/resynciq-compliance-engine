import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EstimateAnalysis } from '../types/services';

interface StoreState {
  estimates: EstimateAnalysis[];
  selectedEstimate: EstimateAnalysis | null;
  filters: {
    dateRange: [Date, Date];
    status: string[];
    searchTerm: string;
  };
  setEstimates: (estimates: EstimateAnalysis[]) => void;
  setSelectedEstimate: (estimate: EstimateAnalysis | null) => void;
  updateFilters: (filters: Partial<StoreState['filters']>) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      estimates: [],
      selectedEstimate: null,
      filters: {
        dateRange: [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date()],
        status: [],
        searchTerm: '',
      },
      setEstimates: (estimates) => set({ estimates }),
      setSelectedEstimate: (estimate) => set({ selectedEstimate: estimate }),
      updateFilters: (newFilters) => 
        set((state) => ({ 
          filters: { ...state.filters, ...newFilters } 
        })),
    }),
    {
      name: 'app-storage',
    }
  )
); 