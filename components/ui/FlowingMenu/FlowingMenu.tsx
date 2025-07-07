"use client";

import React, { useEffect } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { MdArrowRight } from "react-icons/md";

interface MenuItemProps {
  link: string;
  text: string;
  image: string | null;
}

interface FlowingMenuProps {
  items?: MenuItemProps[];
}

const FlowingMenu: React.FC<FlowingMenuProps> = ({ items = [] }) => {
  return (
    <div className="w-full h-full overflow-hidden">
      <nav className="flex flex-col h-full m-0 p-0">
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            {...item}
          />
        ))}
      </nav>
    </div>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({ link, text, image }) => {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const marqueeRef = React.useRef<HTMLDivElement>(null);
  const marqueeInnerRef = React.useRef<HTMLDivElement>(null);

  const animationDefaults = { duration: 0.6, ease: "expo" };

  const handleMouseEnter = () => {
    if (!marqueeRef.current || !marqueeInnerRef.current) return;

    gsap.killTweensOf([marqueeRef.current, marqueeInnerRef.current]);

    gsap.set(marqueeRef.current, { y: "101%" });
    gsap.set(marqueeInnerRef.current, { y: "-101%" });

    gsap.to(marqueeRef.current, {
      y: "0%",
      ...animationDefaults,
    });

    gsap.to(marqueeInnerRef.current, {
      y: "0%",
      ...animationDefaults,
    });
  };

  const handleMouseLeave = () => {
    if (!marqueeRef.current || !marqueeInnerRef.current) return;

    gsap.killTweensOf([marqueeRef.current, marqueeInnerRef.current]);

    gsap.to(marqueeRef.current, {
      y: "101%",
      ...animationDefaults,
    });

    gsap.to(marqueeInnerRef.current, {
      y: "-101%",
      ...animationDefaults,
    });
  };

  const repeatedMarqueeContent = React.useMemo(() => {
    return Array.from({ length: 10 }).map((_, idx) => (
      <React.Fragment key={idx}>
        <span className="text-[#060010] uppercase font-normal text-sm leading-[1.2] p-[1vh_1vw_0]">
          {text}
        </span>
        {image && (
          <div
            className="w-[180px] h-[11vh] my-[2em] mx-[2vw] p-[1em_0] rounded-[50px] bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
        )}
      </React.Fragment>
    ));
  }, [text, image]);

  return (
    <div
      className="flex-1 relative overflow-hidden text-center shadow-[0_-1px_0_0_#fff]"
      ref={itemRef}
    >
      <Link
        className="flex items-center justify-center h-full relative cursor-pointer uppercase no-underline font-semibold text-[#060010] text-[4vh] hover:text-[#060010] focus:text-white focus-visible:text-[#060010]"
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {text}
        <MdArrowRight />
      </Link>
      <div
        className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none bg-white translate-y-[101%] will-change-transform"
        ref={marqueeRef}
      >
        <div
          className="h-full w-[200%] flex"
          ref={marqueeInnerRef}
        >
          <div className="flex items-center relative h-full w-[200%] will-change-transform animate-marquee">
            {repeatedMarqueeContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowingMenu;
