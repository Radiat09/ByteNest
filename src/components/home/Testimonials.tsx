"use client";

import { FaStar } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    id: 1,
    name: "Rahim Ahmed",
    role: "Verified Buyer",
    rating: 5,
    text: "Absolutely love the quality! The product arrived quickly and exactly as described. Will definitely shop here again.",
    avatar: "RA",
  },
  {
    id: 2,
    name: "Sara Khan",
    role: "Verified Buyer",
    rating: 5,
    text: "Best online shopping experience I've had in Bangladesh. Great prices, fast delivery, and excellent customer support.",
    avatar: "SK",
  },
  {
    id: 3,
    name: "Tanvir Hassan",
    role: "Verified Buyer",
    rating: 4,
    text: "Very satisfied with my purchase. The build quality exceeded my expectations. Highly recommend ByteNest to everyone.",
    avatar: "TH",
  },
  {
    id: 4,
    name: "Nusrat Jahan",
    role: "Verified Buyer",
    rating: 5,
    text: "Smooth checkout process and the product was delivered in perfect condition. This is my go-to store now!",
    avatar: "NJ",
  },
  {
    id: 5,
    name: "Arif Rahman",
    role: "Verified Buyer",
    rating: 5,
    text: "Amazing variety of products at competitive prices. The 30-day return policy gives me confidence to try new things.",
    avatar: "AR",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`text-sm ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-16 bg-gray-50 rounded-3xl">
      <div className="text-center mb-10">
        <span className="text-brand text-sm font-semibold">Testimonials</span>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
          What Our Customers Say
        </h2>
      </div>

      <div className="max-w-screen-xl mx-auto px-4">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {testimonials.map((t) => (
            <SwiperSlide key={t.id}>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
                <StarRating rating={t.rating} />
                <p className="text-gray-600 text-sm mt-4 flex-1 leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
