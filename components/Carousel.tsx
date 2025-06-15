"use client";
import { useEffect, useState, useRef } from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import React, { JSX } from "react";

// replace icons with your own if needed
import {
  FiCircle,
  FiCode,
  FiFileText,
  FiLayers,
  FiLayout,
} from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
export interface CarouselItem {
  _id: string;
  label: string | null;
  sku: string | null;
  price: number | null;
  stock: number | null;
  specs: string | null;
  colorOptions: Array<{
    colorName: string | null;
    colorCode: string | null;
    images: Array<string | null> | null;
  }> | null;
}

export interface CarouselProps {
  items: CarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
  showDots?: boolean;
  baseSku: string;
  parentProductInfo: {
    slug: string;
    name?: string;
  };
}

const DEFAULT_ITEMS: CarouselItem[] = [
  {
    _id: "1",
    label: "CH-535A with Armrest",
    sku: "CH-535A",
    price: 320,
    stock: 12,
    specs: "Adjustable height, Mesh back, Armrest",
    colorOptions: [
      {
        colorName: "Black",
        colorCode: "#000000",
        images: ["https://via.placeholder.com/300x200?text=CH-535A+Black"],
      },
      {
        colorName: "Grey",
        colorCode: "#AAAAAA",
        images: ["https://via.placeholder.com/300x200?text=CH-535A+Grey"],
      },
    ],
  },
  {
    _id: "2",
    label: "CH-535B with Headrest",
    sku: "CH-535B",
    price: 370,
    stock: 8,
    specs: "Lumbar support, Tilt mechanism, Headrest",
    colorOptions: [
      {
        colorName: "Blue",
        colorCode: "#0044CC",
        images: ["https://via.placeholder.com/300x200?text=CH-535B+Blue"],
      },
    ],
  },
  {
    _id: "3",
    label: "CH-535C Premium",
    sku: "CH-535C",
    price: 420,
    stock: 5,
    specs: "Premium cushioning, Adjustable armrests, Swivel base",
    colorOptions: [
      {
        colorName: "Red",
        colorCode: "#CC0000",
        images: ["https://via.placeholder.com/300x200?text=CH-535C+Red"],
      },
      {
        colorName: "White",
        colorCode: "#FFFFFF",
        images: ["https://via.placeholder.com/300x200?text=CH-535C+White"],
      },
    ],
  },
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
// const SPRING_OPTIONS = { type: "spring", stiffness: 100, damping: 40 };
const SPRING_OPTIONS = { type: "tween", duration: 0.5, ease: "easeInOut" };

export default function Carousel({
  items = DEFAULT_ITEMS,
  baseWidth = 300,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  loop = false,
  round = false,
  showDots = false,
  baseSku = "",
  parentProductInfo = {
    slug: "",
    name: "",
  },
}: CarouselProps): JSX.Element {
  const containerPadding = 0;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const carouselItems = loop ? [...items, items[0]] : items;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered)) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev === items.length - 1 && loop) {
            return prev + 1;
          }
          if (prev === carouselItems.length - 1) {
            return loop ? 0 : prev;
          }
          return prev + 1;
        });
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [
    autoplay,
    autoplayDelay,
    isHovered,
    loop,
    items.length,
    carouselItems.length,
    pauseOnHover,
  ]);

  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationComplete = () => {
    if (loop && currentIndex === carouselItems.length - 1) {
      setIsResetting(true);
      x.set(0);
      setCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ): void => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      if (loop && currentIndex === items.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex((prev) => Math.min(prev + 1, carouselItems.length - 1));
      }
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      if (loop && currentIndex === 0) {
        setCurrentIndex(items.length - 1);
      } else {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * (carouselItems.length - 1),
          right: 0,
        },
      };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${
        round ? "rounded-full" : "rounded-lg"
      }`}
      style={{
        width: `${baseWidth}px`,
        ...(round && { height: `${baseWidth}px` }),
      }}
    >
      <motion.div
        className="flex"
        {...(items.length > 1 ? { drag: "x", onDragEnd: handleDragEnd } : {})}
        // drag="x"
        // onDragEnd={handleDragEnd}
        {...dragProps}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${currentIndex * trackItemOffset + itemWidth / 2}px 50%`,
          x,
        }}
        animate={{ x: -(currentIndex * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationComplete={handleAnimationComplete}
      >
        {carouselItems.map((item, index) => {
          const isOutOfStock = item.stock === 0;
          const range = [
            -(index + 1) * trackItemOffset,
            -index * trackItemOffset,
            -(index - 1) * trackItemOffset,
          ];
          const outputRange = [90, 0, -90];
          const rotateY = useTransform(x, range, outputRange, { clamp: false });
          return (
            <motion.div
              key={index}
              className={`relative shrink-0 flex flex-col ${
                round
                  ? "items-center justify-center text-center border-0"
                  : "items-start justify-between "
              } overflow-hidden ${items.length > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"} `}
              style={{
                width: itemWidth,
                height: round ? itemWidth : "100%",
                rotateY: rotateY,
                opacity: isOutOfStock ? 0.5 : 1,
                ...(round && { borderRadius: "50%" }),
              }}
              transition={effectiveTransition}
            >
              <div className="relative w-full h-full aspect-square overflow-hidden">
                {item.colorOptions?.[0]?.images?.[0] && (
                  <Image
                    src={item.colorOptions[0].images[0] ?? ""}
                    alt={`${item.label} image`}
                    fill
                    className="object-contain h-full w-full transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px): 33vw"
                    draggable={false}
                  />
                )}

                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black opacity-50 w-full h-full">
                    <span className="text-white font-bold text-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              <Link
                href={`/product/${parentProductInfo.slug}`}
                className="h-full w-full"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                      {parentProductInfo.name
                        ? `${parentProductInfo.name}`
                        : `${baseSku}-${item.label}`}
                    </h2>

                    {parentProductInfo.name && (
                      <h2 className="text-[1rem] font-semibold text-gray-600 truncate">
                        {item.label!.toUpperCase()}
                      </h2>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {item.specs}
                  </p>
                  <p className="mt-2 text-lg font-bold text-gray-900">
                    SAR {item.price?.toFixed(2)}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {showDots && (
        <div
          className={`flex w-full justify-center ${
            round ? "absolute z-20 bottom-12 left-1/2 -translate-x-1/2" : ""
          }`}
        >
          <div className="mt-4 flex w-[150px] justify-between px-8">
            {items.map((_, index) => (
              <motion.div
                key={index}
                className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${
                  currentIndex % items.length === index
                    ? round
                      ? "bg-white"
                      : "bg-[#333333]"
                    : round
                      ? "bg-[#555]"
                      : "bg-[rgba(51,51,51,0.4)]"
                }`}
                animate={{
                  scale: currentIndex % items.length === index ? 1.2 : 1,
                }}
                onClick={() => setCurrentIndex(index)}
                transition={{ duration: 0.15 }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
