import Image from "next/image";
import Link from "next/link";
import { Artwork } from "@types";

const ArtworkMinimal = ({ artwork }: { artwork: Artwork }) => {
  return (
    <div className="flex flex-col w-fit gap-2 select-none">
      <Link href={`/artworks/${artwork.id}`}>
        <a className="relative w-48 md:w-[24rem] h-20 md:h-40">
          <Image
            src={artwork.image}
            alt="Min artwork picture"
            objectFit="cover"
            layout="fill"
            className="rounded-tl-[140px] w-full h-full rounded-bl-[140px] "
          />
        </a>
      </Link>
      <div className="w-full flex justify-end items-center gap-[1ch] font-prata">
        <Link href={`/artworks/${artwork.id}`}>
          <a className="text-primary-100 transition-colors hover:text-primary-200 cursor-pointer">{artwork.title}</a>
        </Link>
        <span className="h-5 bg-grayscale-200 w-1">&nbsp;</span>
        <Link href={`/artists/${artwork.artist.id}`}>
          <a className="text-grayscale-400 transition-colors hover:text-grayscale-500 cursor-pointer">{artwork.artist.name}</a>
        </Link>
      </div>
    </div>
  );
};

export default ArtworkMinimal;
