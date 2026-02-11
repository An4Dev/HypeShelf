export const GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Horror",
  "Fantasy",
] as const;

export type Genre = (typeof GENRES)[number];
