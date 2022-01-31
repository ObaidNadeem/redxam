export interface Artist {
  id: string;
  name: string;
}

export interface Artwork {
  artist: Artist;
  image: string | StaticImageData; // "StaticImageData" should be removed in production.
  title: string;
  price: number;
  id: string;
}
