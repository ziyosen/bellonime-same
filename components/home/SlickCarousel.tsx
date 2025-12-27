'use client';

import Slider, { type CustomArrowProps } from "react-slick";
import type { Anime } from '../../types/anime';
import AnimeCard from "../AnimeCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NextArrow = ({ onClick }: CustomArrowProps) => {
  return (
    <button
      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 z-10 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-soft"
      onClick={onClick}
    >
      <ChevronRight size={24} />
    </button>
  );
};

const PrevArrow = ({ onClick }: CustomArrowProps) => {
  return (
    <button
      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-slate-700 dark:text-slate-300 z-10 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-soft"
      onClick={onClick}
    >
      <ChevronLeft size={24} />
    </button>
  );
};

export default function SlickCarousel({ animes }: { animes: Anime[] }) {
  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    speed: 350,
    arrows: true,
    slidesToShow: 7,
    swipeToSlide: true,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 5 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 3 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
      { breakpoint: 475, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <div className="w-full relative bg-white dark:bg-slate-900 rounded-2xl p-4">
      <Slider {...settings}>
        {animes.map((anime) => (
          <div key={anime.animeId} className="px-2 py-4">
            <AnimeCard anime={anime as Anime} />
          </div>
        ))}
      </Slider>
    </div>
  );
}