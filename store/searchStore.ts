import { create } from "zustand";

interface searchStoreProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const searchStore = create<searchStoreProps>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query.toLowerCase() }),
}));

export default searchStore;
