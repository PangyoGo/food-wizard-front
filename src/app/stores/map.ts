import { StateCreator, create } from "zustand";
import { devtools } from "zustand/middleware";
import { persist } from "zustand/middleware";

type MapsStore = {
  mapsLoaded: boolean;
  setMapsLoaded: () => void;
  resultLocation: { latitude: number; longitude: number } | null;
  setLocation: (latitude: number, longitude: number) => void;
  resetLocation: () => void;
  selectedMoodFood: string | null;
  setSelectedMoodFood: (mood: string) => void;

};

const createStore: StateCreator<MapsStore> = (set) => ({
  mapsLoaded: false,
  setMapsLoaded: () =>
    set(() => ({
      mapsLoaded: true,
    })),
  resultLocation: null,
  setLocation: (latitude: number, longitude: number) =>
    set({ resultLocation: { latitude, longitude } }),
  resetLocation: () => set({ resultLocation: null }),
  selectedMoodFood: null,
  setSelectedMoodFood: (food) => set({ selectedMoodFood: food }),
});

// createStore를 사용하여 create 함수 호출
const useMapsStore = create(
  devtools(persist(createStore, { name: "maps-store" }))
);

export default useMapsStore;
