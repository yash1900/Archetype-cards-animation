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
    imageUrl: "/assets/rabbit.png",
    stats: [],
    bgGradient: "url('/assets/blue_bg.png')" // Deep Blue (Urban)
  },
  {
    id: 2,
    title: "",
    subtitle: "",
    tag: "",
    imageUrl: "/assets/owl.png",
    stats: [],
    bgGradient: "url('/assets/blue_bg_2.png')" // Violet/Purple (Creative)
  },
  {
    id: 3,
    title: "",
    subtitle: "",
    tag: "",
    imageUrl: "/assets/deer.jpg",
    stats: [],
    bgGradient: "url('/assets/blue_bg_3.png')" // Teal/Cyan (Silent)
  }
];