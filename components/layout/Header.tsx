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

const AuthClientWrapperNoSSR = dynamic(() => import("./AuthClientWrapper"), {
  ssr: false,
});

const Header = () => {
  const { user } = useUser();

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
    <header className="flex flex-wrap justify-between px-4 py-4 bg-neutral-900">
      <div className="w-full flex flex-wrap justify-between items-center">
        <Link
          href={"/"}
          className="hover:opacity-50 cursor-pointer mx-auto sm:mx-0 flex items-center justify-center min-w-fit max-w-1.5 mb-2 sm:my-0"
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

        <Form
          action="/search"
          className="w-full sm:flex-1 sm:mx-4 mt-2 sm:mt-0 sm:ml-4"
        >
          <input
            type="text"
            name="query"
            placeholder="Search for products"
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border w-full max-w-3xl "
          />
        </Form>

        {/* Desktop layout: show all links normally on sm+ */}
        <div className="hidden sm:flex items-center justify-between flex-wrap gap-2 flex-1 md:flex-none mt-2 sm:mt-0">
          <ClerkLoaded>
            <Link
              href="/basket"
              className="relative flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              <TrolleyIcon className="w-6 h-6" />
              <span className="text-[0.7rem] md:text-base">My Basket</span>
              {basketTotalQuantity > 0 && productsInBasket?.length! > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-white text-blue-500 text-sm font-bold h-5 w-5 flex items-center justify-center rounded-full">
                  {productsInBasket!.length!}
                </span>
              )}
            </Link>

            <SignedIn>
              <Link
                href="/requested-quotes"
                className="relative flex justify-center items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                <ClipboardIcon className="w-6 h-6" />
                <span className="text-[0.7rem] md:text-base">
                  My Quotations
                </span>
              </Link>
            </SignedIn>
            {user?.publicMetadata.role === "admin" && (
              <Link
                href="/studio"
                className="bg-white hover:bg-blue-700 text-blue-500 hover:text-white text-[0.7rem] md:text-base font-bold py-[0.44rem] px-4 rounded border-blue-300 border"
              >
                Studio
              </Link>
            )}
            <AuthClientWrapperNoSSR />
          </ClerkLoaded>
        </div>

        {/* Mobile layout: collapse everything below form into one accordion */}
        <div className="sm:hidden w-full mt-4">
          <Accordion
            type="single"
            collapsible
          >
            <AccordionItem value="mobile-actions">
              <AccordionTrigger className="text-white">Menu</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-3">
                <ClerkLoaded>
                  <Link
                    href="/basket"
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded justify-between"
                  >
                    <div className="flex gap-2 items-center">
                      <TrolleyIcon className="w-6 h-6" />
                      My Basket
                    </div>

                    <div className="flex rounded-full bg-white text-blue-500 aspect-square w-6 h-6 items-center justify-center text-sm">
                      {productsInBasket?.length || 11}
                    </div>
                  </Link>

                  <SignedIn>
                    <Link
                      href="/requested-quotes"
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      <ClipboardIcon className="w-6 h-6" />
                      My Quotations
                    </Link>
                  </SignedIn>
                  {user?.publicMetadata.role === "admin" && (
                    <Link
                      href="/studio"
                      className="bg-white hover:bg-blue-700 text-blue-500 hover:text-white font-bold py-2 px-4 rounded border border-blue-300"
                    >
                      Studio
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
