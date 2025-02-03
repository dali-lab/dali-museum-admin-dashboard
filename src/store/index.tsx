import { create } from "zustand";
import bearSlice, { IBearSlice } from "./slices/bearSlice";
import fishSlice, { IFishSlice } from "./slices/fishSlice";

const useBoundStore = create<IBearSlice & IFishSlice>()((...a) => ({
  ...bearSlice(...a),
  ...fishSlice(...a),
}));

export default useBoundStore;
