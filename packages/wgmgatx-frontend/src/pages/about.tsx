import Members from "@components/about/Members";
import Navbar from "@components/general/Navbar";
import { NextPage } from "next";
import Image from "next/image";
import wgmgAboutImg from "@public/images/about/about-wgmg.jpeg";
import wgmgHotelsImg from "@public/images/about/hotels-wgmg.jpeg";
import wgmgEventImg from "@public/images/about/event-wgmg.jpeg";

const About: NextPage = () => {
  return (
    <>
      <Navbar title="About" />
      <div className="flex flex-col items-center md:mx-28">
        <Image
          src={wgmgAboutImg || ""}
          alt="WGMG About IMG"
          width="1080px"
          height="1080px"
        />
        <p className="max-w-lg px-3 text-center opacity-75 text-grayscale-400 mb-60">
          To help humanity thrive by enabling all teams to work together
          effortlessly. To be Earth’s most customer-centric company, where
          customers can find and discover anything they might want to buy
          online, and endeavors to offer its customers the lowest possible
          prices.
        </p>
        <div className="mb-60">
          <Image
            src={wgmgHotelsImg || ""}
            alt="WGMG About IMG"
            width="1080px"
            height="1080px"
          />
        </div>
        <Image
          src={wgmgEventImg || ""}
          alt="WGMG About IMG"
          width="1080px"
          height="1080px"
        />
        {/* <Members /> */}
      </div>
    </>
  );
};

export default About;
