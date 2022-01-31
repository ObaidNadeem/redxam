import Image from "next/image";
import unsplash from "@public/unsplash.png";

const Hero = () => {
  return (
    <section>
      <div className="relative w-[100%] lg:w-[80%]">
        <div className="relative">
          <Image src={unsplash} alt="frame" objectFit="cover" className="lg:rounded-md" />
        </div>
        <div className="absolute top-1/2 left-1/2 w-10/12 h-full -translate-x-1/2 -translate-y-1/2 flex justify-center items-center flex-col">
          <div className="font-futura_black text-4xl md:text-8xl lg:text-9xl uppercase" id="meta-word">
            Mission
          </div>
          <div className="text-md md:text-lg text-center">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Nostrum quia ullam, alias molestias nemo maxime officiis autem quo eos
            tempora nam accusantium nesciunt adipisci aperiam, quae sunt, laboriosam culpa itaque.
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
