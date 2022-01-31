import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Artwork } from "@types";
import ArtworkCard from "@components/cards/ArtworkMinimal";

const Carousel = ({ artworks }: { artworks: Artwork[] }) => {
  return (
    <section>
      <Swiper className="!w-full cursor-grab" slidesPerView="auto">
        {artworks.map((artwork, index) => (
          <SwiperSlide key={index} className="flex justify-center items-center">
            <ArtworkCard artwork={artwork} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Carousel;
