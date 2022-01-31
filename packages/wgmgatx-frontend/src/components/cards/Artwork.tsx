import { BadgeCheckIcon, ShareIcon } from "@heroicons/react/solid";
import { Artwork } from "@types";
import Image from "next/image";
import Link from "next/link";

const Artwork = ({ artwork }: { artwork: Artwork }) => {
  return (
    <div className="flex justify-between items-start flex-col md:flex-row w-full h-full gap-5 md:gap-10">
      <div className="flex justify-center md:justify-start items-center max-w-full">
        <div className="relative w-80 md:w-[24rem] cursor-pointer transition-[border-color,transform] hover:scale-105 border-[1px] border-grayscale-200 hover:border-grayscale-100 rounded-2xl">
          <Image src={artwork.image} alt="artwork picture" layout="responsive" objectFit="cover" className="rounded-2xl !p-1" />
        </div>
      </div>
      <div className="flex flex-col gap-12 h-full w-80">
        <div className="flex flex-col gap-5 max-h-full">
          <div>
            <span className="opacity-50 font-futura_book">by </span>
            <Link href={`/artists/${artwork.artist.id}`}>
              <a className="underline text-primary-100 font-futura_heavy transition-colors hover:text-primary-200">
                {artwork.artist.name}
                <BadgeCheckIcon className="h-5 w-5 fill-primary-100 ml-[.5ch] inline-block transition-colors hover:fill-primary-200" />
              </a>
            </Link>
          </div>
          <div className="font-prata text-3xl md:text-5xl text-primary-100 max-w-full">{artwork.title}</div>
          <div className="font-prata text-grayscale-400 w-1/2 flex justify-center items-center border-[1px] border-grayscale-100 py-3 px-4 rounded-full">
            ${artwork.price}
            <span className="text-xs">.00</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="uppercase font-prata bg-grayscale-300 hover:bg-grayscale-200 active:bg-grayscale-100 transition-colors text-grayscale-400 py-4 font-semibold px-8 rounded-full min-w-[60%]">
            Buy Now
          </button>
          <button className="bg-grayscale-300 hover:bg-grayscale-200 active:bg-grayscale-100 py-4 px-4 rounded-full">
            <ShareIcon className="h-5 w-5 fill-grayscale-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Artwork;
