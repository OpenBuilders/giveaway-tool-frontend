export interface JettonTemplate {
  id: string;
  name: string; // Display name
  symbol: string;
  address: string; // Jetton master address
  image?: string; // Optional logo URL
}

// Minimal curated set; expand as needed or replace with backend-driven data later
export const JETTON_TEMPLATES: JettonTemplate[] = [
  {
    id: "usdt",
    name: "Tether USD",
    symbol: "USD₮",
    address: "EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs",
    image: "https://tether.to/images/logoCircle.png",
  },
  {
    id: "not",
    name: "Notcoin",
    symbol: "NOT",
    address: "EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT",
    image: "https://cdn.joincommunity.xyz/clicker/not_logo.png",
  },
  {
    id: "dogs",
    name: "Dogs",
    symbol: "DOGS",
    address: "EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS",
    image: "https://cdn.dogs.dev/dogs.png",
  },
  {
    id: "px",
    name: "Not Pixel",
    symbol: "PX",
    address: "EQB420yQsZobGcy0VYDfSKHpG2QQlw-j1f_tPu1J488I__PX",
    image: "https://static.notpx.app/px_logo.png",
  },
];
