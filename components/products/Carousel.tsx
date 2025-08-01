"use client";
import {
  motion,
  PanInfo,
  Transition,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { JSX, useEffect, useRef, useState } from "react";

// replace icons with your own if needed
import {
  AdjustedVariantType,
  getAllVariantStock,
} from "@/utils/isProductOutOfStock";
import { PortableText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface CarouselProps {
  items: AdjustedVariantType[];
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

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
// const SPRING_OPTIONS = { type: "spring", stiffness: 100, damping: 40 };
const SPRING_OPTIONS: Transition = {
  type: "tween",
  duration: 0.8,
  ease: "easeInOut",
};

export default function Carousel({
  items,
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
  const router = useRouter();
  const dragStartX = useRef<number | null>(null);
  const dragThreshold = 10; // in pixels
  const containerPadding = 0;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const validItems = items.filter(
    (variant) => variant?.colorOptions && variant.colorOptions.length > 0
  );

  autoplay = validItems.length > 1;

  const carouselItems = loop ? [...validItems, validItems[0]] : validItems;

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
          if (prev === validItems.length - 1 && loop) {
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
    validItems.length,
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
      if (loop && currentIndex === validItems.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex((prev) => Math.min(prev + 1, carouselItems.length - 1));
      }
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      if (loop && currentIndex === 0) {
        setCurrentIndex(validItems.length - 1);
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

  // Stable number of transforms (e.g., max 10 items expected)
  const maxItems = 10;
  const rotateTransforms = Array.from({ length: maxItems }, (_, index) => {
    const range = [
      -(index + 1) * trackItemOffset,
      -index * trackItemOffset,
      -(index - 1) * trackItemOffset,
    ];
    return useTransform(x, range, [90, 0, -90], { clamp: false });
  });

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
        {...(validItems.length > 1
          ? { drag: "x", onDragEnd: handleDragEnd }
          : {})}
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
          const isOutOfStock = getAllVariantStock(item) === 0;
          const range = [
            -(index + 1) * trackItemOffset,
            -index * trackItemOffset,
            -(index - 1) * trackItemOffset,
          ];
          const outputRange = [90, 0, -90];
          const rotateY = rotateTransforms[index];
          return (
            <motion.div
              key={`${item._id}-${index}`}
              className={`relative shrink-0 flex flex-col ${
                round
                  ? "validItems-center justify-center text-center border-0"
                  : "validItems-start justify-between "
              } overflow-hidden ${validItems.length > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"} `}
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
                    onMouseDown={(e) => {
                      dragStartX.current = e.clientX;
                    }}
                    onMouseUp={(e) => {
                      if (
                        dragStartX.current !== null &&
                        Math.abs(e.clientX - dragStartX.current) < dragThreshold
                      ) {
                        router.push(
                          `/product/${parentProductInfo.slug}?variant=${item.label!}&color=${item.colorOptions![0].colorName}`
                        );
                      }
                    }}
                    onTouchStart={(e) => {
                      dragStartX.current = e.touches[0].clientX;
                    }}
                    onTouchEnd={(e) => {
                      const endX = e.changedTouches[0].clientX;
                      if (
                        dragStartX.current !== null &&
                        Math.abs(endX - dragStartX.current) < dragThreshold
                      ) {
                        router.push(
                          `/product/${parentProductInfo.slug}?variant=${item.label!}&color=${item.colorOptions![0].colorName}`
                        );
                      }
                    }}
                  />
                )}

                {isOutOfStock && (
                  <div className="relative inset-0 flex validItems-center justify-center bg-black opacity-50 w-full h-full">
                    <span className="text-white font-bold text-lg absolute top-1 left-1">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>
              <Link
                href={{
                  pathname: `/product/${parentProductInfo.slug}`,
                  query: {
                    variant: item.label,
                    color: item.colorOptions![0].colorName,
                  },
                }}
                className="h-full w-full"
              >
                <div className="p-4">
                  <div
                    className={`flex ${item.label?.length! > 1 ? "flex-col justify-center" : "justify-between validItems-center"} `}
                  >
                    <h2 className="text-lg font-semibold text-gray-800 truncate">
                      {parentProductInfo.name
                        ? `${parentProductInfo.name}`
                        : `${baseSku}${item.label}`}
                    </h2>

                    {parentProductInfo.name && (
                      <h2 className="text-[1rem] font-semibold text-gray-600 truncate">
                        {item.label!.toUpperCase()}
                      </h2>
                    )}
                  </div>

                  <div className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {Array.isArray(item.colorOptions![0]!.specs) && (
                      <PortableText value={item.colorOptions![0]!.specs} />
                    )}
                  </div>
                  <p className="mt-2 text-lg font-bold text-gray-900">
                    SR {item.colorOptions![0].price?.toFixed(2)}
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
            {validItems.map((_, index) => (
              <motion.div
                key={`${_._id}-${index}`}
                className={`h-2 w-2 rounded-full cursor-pointer transition-colors duration-150 ${
                  currentIndex % validItems.length === index
                    ? round
                      ? "bg-white"
                      : "bg-[#333333]"
                    : round
                      ? "bg-[#555]"
                      : "bg-[rgba(51,51,51,0.4)]"
                }`}
                animate={{
                  scale: currentIndex % validItems.length === index ? 1.2 : 1,
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
