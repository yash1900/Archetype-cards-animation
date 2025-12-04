import { CardDimensions, Dimensions, CardData } from './types';

export const VIEWPORT_DIMENSIONS: Dimensions = {
  width: 164.6,
  height: 297,
};

export const CARD_DIMENSIONS: CardDimensions = {
  width: VIEWPORT_DIMENSIONS.width * 0.7066, // Exactly 70.66% of viewport width
  height: 235.1,
  imageWidth: 99.2,
  imageHeight: 139.6,
  gap: 8.5,
};

export const CARDS_DATA: CardData[] = [
  {
    id: 1,
    title: "",
    subtitle: "",
    tag: "",
    imageUrl: "https://images.unsplash.com/photo-1512316609839-ce289d3eba0a?q=80&w=1000&auto=format&fit=crop", 
    stats: [],
    bgGradient: "linear-gradient(to bottom, #0f172a, #1e3a8a)" // Deep Blue (Urban)
  },
  {
    id: 2,
    title: "",
    subtitle: "",
    tag: "",
    imageUrl: "https://images.unsplash.com/photo-1449824913929-2b6a6af686c4?q=80&w=1000&auto=format&fit=crop", 
    stats: [],
    bgGradient: "linear-gradient(to bottom, #2e1065, #7c3aed)" // Violet/Purple (Creative)
  },
  {
    id: 3,
    title: "",
    subtitle: "",
    tag: "",
    imageUrl: "https://images.unsplash.com/photo-1515405295579-ba7f9f1b8cd8?q=80&w=1000&auto=format&fit=crop", 
    stats: [],
    bgGradient: "linear-gradient(to bottom, #042f2e, #0d9488)" // Teal/Cyan (Silent)
  }
];