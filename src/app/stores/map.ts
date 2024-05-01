import { create } from "zustand";

type MapsStore = {
  mapsLoaded: boolean;
  setMapsLoaded: () => void;
};

const useMapsStore = create<MapsStore>((set) => ({
  mapsLoaded: false,
  setMapsLoaded: () =>
    set(() => ({
      mapsLoaded: true,
    })),
}));

export default useMapsStore;
