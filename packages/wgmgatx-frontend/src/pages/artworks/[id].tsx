import { useRouter } from "next/router";
import Navbar from "@components/general/Navbar";
import mockData from "@mock-data";
import Artwork from "@components/cards/Artwork";
import MoreFromArtist from "@components/sections/MoreFromArtist";

const Product = () => {
  const router = useRouter();
  const { id } = router.query;

  const currrentArtwork = mockData.artworks.find((artwork) => artwork.id === id);

  if (!currrentArtwork) return <h1>Not Found!</h1>;
  const artistArtworks = mockData.artworks.filter((artwork) => artwork.artist.id === currrentArtwork.artist.id);

  return (
    <>
      <Navbar title={currrentArtwork.title} />
      <section className="min-w-full max-w-7xl flex flex-col justify-center gap-10 items-center -mt-16 mb-20 md:mt-16">
        <div className="flex flex-col gap-12 w-80 md:w-[48rem]">
          <Artwork artwork={currrentArtwork} />
          {artistArtworks.length > 1 && <MoreFromArtist currrentArtwork={currrentArtwork} artistArtworks={artistArtworks} />}
        </div>
      </section>
    </>
  );
};

export default Product;
