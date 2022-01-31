import { Artwork } from "@types";
import Image from "next/image";
import Link from "next/link";

const MoreFromArtist = ({ currrentArtwork, artistArtworks }: { currrentArtwork: Artwork; artistArtworks: Artwork[] }) => {
  return (
    <>
      <div className="w-full h-60 bg-grayscale-300">&nbsp;</div>
      <div className="h-px w-full bg-grayscale-300">&nbsp;</div>
      <div className="w-full flex flex-col gap-[2ex]">
        <div className="w-full h-fit flex after:content-[''] after:flex-grow after:h-6 md:after:h-12 after:bg-grayscale-300 items-center justify-start gap-[5%]">
          <span className="flex-shrink-0 uppercase font-futura_heavy text-grayscale-300 text-4xl md:text-7xl">More From</span>
        </div>
        <div className="w-full h-fit after:content-[''] after:flex-grow after:h-6 md:after:h-12 after:bg-grayscale-300 flex items-center justify-start gap-[5%]">
          <span className="flex-shrink-0 uppercase font-prata font-semibold text-primary-100 text-4xl md:text-7xl">Pato Gomez</span>
        </div>
        <div className="w-full flex flex-wrap justify-evenly items-start gap-5">
          {artistArtworks.map(
            (artwork) =>
              currrentArtwork.id !== artwork.id && (
                <Link href={`/artworks/${artwork.id}`}>
                  <a className="relative w-32 md:w-80 cursor-pointer transition-[border-color,transform] hover:scale-105 border-[1px] border-grayscale-200 hover:border-grayscale-100 rounded-2xl">
                    <Image src={artwork.image} alt="artwork" layout="responsive" objectFit="cover" className="rounded-2xl !p-1" />
                  </a>
                </Link>
              )
          )}
        </div>
      </div>
    </>
  );
};

export default MoreFromArtist;
