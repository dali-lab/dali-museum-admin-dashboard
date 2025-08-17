export interface IAnnotation {
  x: number;
  y: number;
  title: string;
  text: string;
}

export interface IPoint {
  x: number;
  y: number;
}

export enum Modes {
  EXHIBITION = "exhibition",
  POSTVIEW = "post_viewing",
  COMPARATIVE = "comparative",
}

export interface IPainting {
  id: string;

  name: string;
  alias: string;
  year: number;
  description: string;

  url: string;

  annotations: IAnnotation[];
  activePostviewImage: string; // id

  curatorHeatmapId: string;
  curatorHeatmapLength: number;

  annotationColor: string;
  darkText: boolean;

  modesPossible: Record<Modes, boolean>;
  modesEnabled: Record<Modes, boolean>;
}

export interface ICuratorHeatmap {
  paintingId: string;
  points: IPoint[];
}
