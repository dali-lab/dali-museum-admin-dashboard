import { StateCreator } from 'zustand';

export interface IFishSlice {
  fishCount: number
  addFish: () => void
}

const fishSlice: StateCreator<IFishSlice, [], [], IFishSlice> = (set) => ({
  fishCount: 0,
  addFish: () => set((state) => ({ fishCount: state.fishCount + 1 })),
});

export default fishSlice;