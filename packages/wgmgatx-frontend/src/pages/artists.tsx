import { NextPage } from "next";
import Image from "next/image";
import Navbar from "@components/general/Navbar";
import ArtistList from "@components/artists/ArtistList";
import wgmgArtistsImg from "@public/images/artists/artists-wgmg.jpeg";

const Artists: NextPage = () => {
  return (
    <>
      <Navbar title="Artists" />
      <div className="flex justify-center py-20">
        <Image
          src={wgmgArtistsImg || ""}
          alt="WGMG Artists IMG"
          width="1080px"
          height="1080px"
        />
      </div>
      {/* <ArtistList /> */}
    </>
  );
};

export default Artists;
