import Navbar from "@components/general/Navbar";
import { NextPage } from "next";
import Image from "next/image";
import wgmgEventImg from "@public/images/about/event-wgmg.jpeg";
import wgmgExpectImg from "@public/images/upcoming/expect-wgmg.jpeg";
import wgmgSupportingArtists from "@public/images/upcoming/supporting-artists-wgmg.jpeg";

const UpcomingEvents: NextPage = () => {
  return (
    <>
      <Navbar title="Upcoming Events" />
      <div className="flex flex-col items-center min-h-screen py-20 md:mx-28">
        <Image
          src={wgmgEventImg || ""}
          alt="WGMG Event IMG"
          width="1080px"
          height="1080px"
        />
        <div className="my-20">
          <Image
            src={wgmgExpectImg || ""}
            alt="WGMG WhatTo Expect IMG"
            width="1080px"
            height="1080px"
          />
        </div>
        <Image
          src={wgmgSupportingArtists || ""}
          alt="WGMG Artists Supporting Artists IMG"
          width="1080px"
          height="1080px"
        />
      </div>
    </>
  );
};

export default UpcomingEvents;
