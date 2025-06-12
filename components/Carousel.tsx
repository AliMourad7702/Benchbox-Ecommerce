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
  items?: CarouselItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  round?: boolean;
  showDots?: boolean;
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
}: CarouselProps): JSX.Element {
  const containerPadding = 16;
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
      className={`relative overflow-hidden p-4 ${
        round
          ? "rounded-full border border-white"
          : "rounded-lg border border-[#222]"
      }`}
      style={{
        width: `${baseWidth}px`,
        ...(round && { height: `${baseWidth}px` }),
      }}
    >
      <motion.div
        className="flex"
        drag="x"
        {...dragProps}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          perspective: 1000,
          perspectiveOrigin: `${currentIndex * trackItemOffset + itemWidth / 2}px 50%`,
          x,
        }}
        onDragEnd={handleDragEnd}
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
                  ? "items-center justify-center text-center bg-[#060010] border-0"
                  : "items-start justify-between bg-[#222] border border-[#222] rounded-[12px]"
              } overflow-hidden cursor-grab active:cursor-grabbing`}
              style={{
                width: itemWidth,
                height: round ? itemWidth : "100%",
                rotateY: rotateY,
                opacity: isOutOfStock ? 0.5 : 1,
                ...(round && { borderRadius: "50%" }),
              }}
              transition={effectiveTransition}
            >
              <div className="p-5 relative">
                <div className="mb-1 font-bold text-white">
                  {item.label} — <span className="text-sm">({item.sku})</span>
                </div>
                <p className="text-sm text-white">{item.specs}</p>
                <p className="text-sm text-gray-300">Price: SAR {item.price}</p>
                {isOutOfStock ? (
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded shadow">
                    Out of Stock
                  </div>
                ) : (
                  <p className="text-sm text-gray-300">Stock: {item.stock}</p>
                )}

                {item.colorOptions?.[0]?.images?.[0] && (
                  <img
                    src={item.colorOptions[0].images[0] ?? ""}
                    alt={`${item.label} image`}
                    className="mt-2 rounded-md object-cover h-40 w-full"
                  />
                )}
              </div>
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
