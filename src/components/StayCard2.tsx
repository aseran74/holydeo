'use client';
import React, { FC } from "react";
import GallerySlider from "@/components/GallerySlider";
import Link from "next/link";

export interface StayCard2Props {
  className?: string;
  data?: any;
  size?: "default" | "small";
}

const StayCard2: FC<StayCard2Props> = ({
  size = "default",
  className = "",
  data = {},
}) => {
  // Adaptar a los campos reales de Supabase
  const {
    id,
    gallery = [],
    title = "Sin título",
    address = "Sin dirección",
    bedrooms = 0,
    price = 0,
    property_type = "",
    rental_form = "",
  } = data;

  const gallerySafe = Array.isArray(gallery) && gallery.length > 0 ? gallery : ["/no-image.jpg"];

  const href = `/listing-stay-detail/${id}`;

  const renderSliderGallery = () => {
    return (
      <div className="relative w-full">
        <GallerySlider
          uniqueID={`StayCard2_${id}`}
          ratioClass="aspect-w-12 aspect-h-11"
          galleryImgs={gallerySafe}
          imageClass="rounded-lg"
          href={href}
        />
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={size === "default" ? "mt-3 space-y-3" : "mt-2 space-y-2"}>
        <div className="space-y-2">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {property_type} · {bedrooms} habitaciones
          </span>
          <div className="flex items-center space-x-2">
            <h2
              className={`font-semibold capitalize text-neutral-900 dark:text-white ${
                size === "default" ? "text-base" : "text-base"
              }`}
            >
              <span className="line-clamp-1">{title}</span>
            </h2>
          </div>
          <div className="flex items-center text-neutral-500 dark:text-neutral-400 text-sm space-x-1.5">
            <span>{address}</span>
          </div>
        </div>
        <div className="w-14 border-b border-neutral-100 dark:border-neutral-800"></div>
        <div className="flex justify-between items-center">
          <span className="text-base font-semibold">
            {price ? `€${price}` : "Sin precio"}
            {size === "default" && (
              <span className="text-sm text-neutral-500 dark:text-neutral-400 font-normal">/noche</span>
            )}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={`nc-StayCard2 group relative ${className}`}>
      {renderSliderGallery()}
      <Link href={href}>{renderContent()}</Link>
    </div>
  );
};

export default StayCard2;
