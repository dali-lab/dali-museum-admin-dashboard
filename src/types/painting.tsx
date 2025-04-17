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

export interface IPainting {
  id: string;

  name: string;
  alias: string;
  year: number;
  description: string;

  url: string;

  annotations: IAnnotation[];
  curatorHeatmap: IPoint[];
  activePostviewImage: string; // id

  annotationColor: string;
  darkText: boolean;

  exhibitionEnabled: boolean;
  researchEnabled: boolean;

  exhibitionPossible: boolean;
  researchPossible: boolean;
}
