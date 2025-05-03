import { IPainting } from "@/types/painting";
import { FEATURES } from "./constants";

// return either white or black based on background color hex
// written by github copilot
export function contrastingColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

export function paintingFeatures(painting: IPainting) {
  const features = [];

  if (
    painting.annotations &&
    painting.annotations.length &&
    painting.annotations.length > 0
  ) {
    features.push(FEATURES.ANNOTATIONS);
  }
  if (
    painting.curatorHeatmapPoints &&
    painting.curatorHeatmapPoints.length &&
    painting.curatorHeatmapPoints.length > 0
  ) {
    features.push(FEATURES.CURATOR_HEATMAP);
  }
  if (painting.activePostviewImage && painting.activePostviewImage != "") {
    features.push(FEATURES.POST_VIEWING);
  }

  return features;
}

/** return true if the value is a number or an empty string */
export const isNumber = (value: string) => {
  return /^\d*$/.test(value);
};

/** return the parsed number, or undefined if the value is an empty string. */
export const parseNumber = (value: string) => {
  return /^\d+$/.test(value) ? parseInt(value) : undefined;
};
