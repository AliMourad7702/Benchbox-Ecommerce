"use client";

import {
  ClerkLoaded,
  SignedIn,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Form from "next/form";
import { PackageIcon, TrolleyIcon } from "@sanity/icons";

const Header = () => {
  const { user } = useUser();

  const createClerkPasskey = async () => {
    try {
      const response = await user?.createPasskey();
      console.log(response);
    } catch (err) {
      console.error("Error: ", JSON.stringify(err, null, 2));
    }
  };

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
          />
        </Link>

        <Form
          action="/search"
          className="w-full  sm:flex-1 sm:mx-4 mt-2 sm:mt-0 sm:ml-4"
        >
          <input
            type="text"
            name="query"
            placeholder="Search for products"
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border w-full max-w-3xl "
          />
        </Form>

        <div className="flex items-center justify-between gap-2 flex-1 md:flex-none space-x-4 mt-2 sm:mt-0">
          <Link
            href="/basket"
            className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 hover:opacity-50 text-white font-bold py-2 px-4 rounded"
          >
            <TrolleyIcon className="w-6 h-6" />
            {/* TODO span item count once global state is implemented */}
            <span>My Basket</span>
          </Link>

          {/* User Area */}
          <ClerkLoaded>
            {/* <SignedIn> tag is a built in tag from Clerk that renders children only if the user is logged in */}
            <SignedIn>
              <Link
                href={"/orders"}
                className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                <PackageIcon className="w-6 h-6" />
                <span>My Orders</span>
              </Link>
            </SignedIn>

            {user ? (
              <div className="flex items-center space-x-2">
                <UserButton />
                <div className="hidden sm:block text-xs">
                  <p className="text-gray-400">Welcome Back</p>
                  <p className="font-bold text-blue-500">{user.fullName} !</p>
                </div>
              </div>
            ) : (
              <SignInButton mode="modal" />
            )}

            {user?.passkeys.length === 0 && (
              <button
                onClick={createClerkPasskey}
                className="bg-white hover:bg-blue-700 hover:text-white animate-pulse text-blue-500 font-bold py-2 px-4 rounded border-blue-300 border"
              >
                Create passkey
              </button>
            )}
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
};

export default Header;
