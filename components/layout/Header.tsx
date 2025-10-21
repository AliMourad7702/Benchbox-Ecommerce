"use client";

import { useBasket } from "@/hooks/useBasket";
import { ClerkLoaded, SignedIn, useUser } from "@clerk/nextjs";
import { ClipboardIcon, TrolleyIcon } from "@sanity/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import dynamic from "next/dynamic";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { TbCategory } from "react-icons/tb";
import { usePathname } from "next/navigation";

const AuthClientWrapperNoSSR = dynamic(() => import("./AuthClientWrapper"), {
  ssr: false,
});

const Header = () => {
  const { user } = useUser();

  const pathname = usePathname();

  // const createClerkPasskey = async () => {
  //   try {
  //     const response = await user?.createPasskey();
  //     // console.log(response);
  //   } catch (err) {
  //     console.error("Error: ", JSON.stringify(err, null, 2));
  //   }
  // };

  const { basketTotalQuantity, productsInBasket } = useBasket();

  return (
    <header className="sticky -top-30  z-99 lg:top-0 flex flex-wrap justify-between px-4 py-4 bg-neutral-900 shadow-md">
      <div className="w-full flex flex-wrap justify-between items-center relative">
        <Link
          href={"/"}
          className="hover:opacity-50 cursor-pointer mx-auto lg:mx-0 flex items-center justify-center min-w-fit max-w-1.5 mb-2 lg:my-0"
        >
          <Image
            src={"/images/Benchbox-logo.png"}
            alt="Main Logo"
            className="min-w-7"
            width={200}
            height={200}
            priority
          />
        </Link>

        <div className="sticky top-4 z-99 w-full flex justify-between gap-2 lg:flex-1">
          <Form
            action="/search"
            className="w-full lg:flex-1 lg:mx-4 mt-2 lg:mt-0 lg:ml-4"
          >
            <input
              type="text"
              name="query"
              placeholder="Search for products"
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border w-full lg:max-w-3xl "
            />
          </Form>
          <Link
            href="/basket"
            passHref
            className="relative flex justify-center items-center bg-neutral-900 border-white border text-white font-bold px-3 rounded lg:hidden mt-2"
          >
            <TrolleyIcon className="w-6 h-6" />
            {basketTotalQuantity > 0 && productsInBasket?.length! > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-white text-black text-sm font-bold h-5 w-5 flex items-center justify-center rounded-full">
                {productsInBasket!.length!}
              </span>
            )}
          </Link>
        </div>

        {/* Desktop layout: show all links normally on lg+ */}
        <div className="hidden lg:flex items-center justify-between flex-wrap gap-2 flex-1 md:flex-none mt-2 lg:mt-0">
          <ClerkLoaded>
            <Link
              href="/categories"
              passHref
              className="group relative flex justify-center items-center gap-2 text-white font-bold py-2 px-4 rounded"
            >
              <TbCategory className="w-6 h-6" />
              <span className="text-[0.7rem] md:text-base">Categories</span>
              {/* underline animation (stays visible when active) */}
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-300 ease-in-out
      ${pathname.includes("/categories") ? "w-full" : "w-0 group-hover:w-full"}`}
              ></span>
            </Link>

            <Link
              href="/basket"
              passHref
              className="group relative flex justify-center items-center gap-2 text-white font-bold py-2 px-4 rounded"
            >
              <TrolleyIcon className="w-6 h-6" />
              <span className="text-[0.7rem] md:text-base">My Basket</span>
              {basketTotalQuantity > 0 && productsInBasket?.length! > 0 && (
                <span className="absolute -top-1.5 -right-1 bg-white text-black text-sm font-bold h-5 w-5 flex items-center justify-center rounded-full">
                  {productsInBasket!.length!}
                </span>
              )}
              <span
                className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-300 ease-in-out
      ${pathname.includes("/basket") ? "w-full" : "w-0 group-hover:w-full"}`}
              ></span>
            </Link>

            <SignedIn>
              <Link
                href="/requested-quotes"
                passHref
                className="group relative flex justify-center items-center gap-2 text-white font-bold py-2 px-4 rounded"
              >
                <ClipboardIcon className="w-6 h-6" />
                <span className="text-[0.7rem] md:text-base">
                  My Quotations
                </span>
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-300 ease-in-out
      ${pathname.includes("/requested-quotes") ? "w-full" : "w-0 group-hover:w-full"}`}
                ></span>
              </Link>
            </SignedIn>
            {user?.publicMetadata.role === "admin" && (
              <Link
                href="/studio"
                passHref
                className="group relative text-white text-[0.7rem] md:text-base font-bold py-[0.44rem] px-4 rounded"
              >
                Studio
                {/* underline animation */}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 ease-in-out group-hover:w-full"></span>
              </Link>
            )}
            <AuthClientWrapperNoSSR />
          </ClerkLoaded>
        </div>

        {/* Mobile/Tablets layout: collapse everything below form into one accordion */}
        <div className="lg:hidden w-full mt-4">
          <Accordion
            type="single"
            collapsible
          >
            <AccordionItem value="mobile-actions">
              <AccordionTrigger className="text-white">Menu</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3">
                <ClerkLoaded>
                  <Link
                    href="/categories"
                    passHref
                    className="group relative flex items-center gap-2 text-white font-bold py-2 px-4 rounded sm:justify-center"
                  >
                    <TbCategory className="w-6 h-6" />
                    Categories
                    {/* underline animation (stays visible when active) */}
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-300 ease-in-out
      ${pathname.includes("/categories") ? "w-full" : "w-0 group-hover:w-full"}
    `}
                    ></span>
                  </Link>

                  <SignedIn>
                    <Link
                      href="/requested-quotes"
                      passHref
                      className="group relative flex items-center gap-2  text-white font-bold py-2 px-4 rounded sm:justify-center"
                    >
                      <ClipboardIcon className="w-6 h-6" />
                      My Quotations
                      {/* underline animation (stays visible when active) */}
                      <span
                        className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-300 ease-in-out
      ${pathname.includes("/requested-quotes") ? "w-full" : "w-0 group-hover:w-full"}
    `}
                      ></span>
                    </Link>
                  </SignedIn>
                  {user?.publicMetadata.role === "admin" && (
                    <Link
                      href="/studio"
                      className="group relative text-white hover:text-white font-bold py-2 px-4 rounded text-center"
                    >
                      Studio
                      {/* underline animation */}
                      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 ease-in-out group-hover:w-full"></span>
                    </Link>
                  )}
                  <AuthClientWrapperNoSSR />
                </ClerkLoaded>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </header>
  );
};

export default Header;
