import Navbar from "@components/general/Navbar";
import { NextPage } from "next";

const Shop: NextPage = () => {
  return (
    <>
      <Navbar title="Shop" />
      <div className="flex justify-center min-h-screen pt-40"></div>
    </>
  );
};

export default Shop;
