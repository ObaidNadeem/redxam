import logo from "@public/logo.png";
import Image from "next/image";
import Link from "next/link";

const Logo = () => (
  <Link href="/">
    <a className="mr-[50%] md:m-0 transition-[filter] duration-300 hover:brightness-125">
      <Image src={logo} alt="logo" width="350px" height="225px" layout="fixed" />
    </a>
  </Link>
);

export default Logo;
