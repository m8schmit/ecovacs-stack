import { Projection } from 'ol/proj';

export interface LayerProps {
  projection?: Projection;
  ZIndex?: number;
}

export interface InteractionProps {
  isInteractable: boolean;
}
