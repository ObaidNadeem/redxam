import ContactForm from "@components/contact/ContactForm";
import Navbar from "@components/general/Navbar";
import { NextPage } from "next";
import Image from "next/image";
import wgmgWhiteLogo from "@public/images/contact/white-logo-wgmg.jpeg";

const Contact: NextPage = () => {
  return (
    <>
      <Navbar title="Contact" />
      <div className="flex flex-col items-center min-h-screen pt-40">
        <ContactForm />
        <Image
          src={wgmgWhiteLogo || ""}
          alt="WGMG White Logo IMG"
          width="1080px"
          height="1080px"
        />
      </div>
    </>
  );
};

export default Contact;
