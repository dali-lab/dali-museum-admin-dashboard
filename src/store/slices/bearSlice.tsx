import { StateCreator } from 'zustand';

export interface IBearSlice {
  bearCount: number
  addBear: () => void
}

const bearSlice: StateCreator<IBearSlice, [], [], IBearSlice> = (set) => ({
  bearCount: 0,
  addBear: () => set((state) => ({ bearCount: state.bearCount + 1 })),
});

export default bearSlice;