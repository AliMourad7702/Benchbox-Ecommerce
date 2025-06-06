"use client";

import { ClerkLoaded, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Form from "next/form";
import { PackageIcon, TrolleyIcon } from "@sanity/icons";

const Header = () => {
  const { user } = useUser();
  console.log("user: ", user);

  return (
    <header className="flex flex-wrap justify-between px-4 py-2 bg-slate-800">
      <div className="w-full flex justify-between items-center">
        <Link
          href={"/"}
          className="hover:opacity-50 cursor-pointer mx-auto sm:mx-0 flex items-center justify-center min-w-fit max-w-1.5"
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
          className="w-full sm:w-auto sm:flex-1 sm:mx-4 mt-2 sm:mt-0 ml-0.5"
        >
          <input
            type="text"
            name="query"
            placeholder="Search for products"
            className="bg-gray-100 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border w-full max-w-3xl "
          />
        </Form>
        <div className="flex justify-between gap-2">
          <Link
            href="/basket"
            className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 hover:opacity-50 text-white font-bold py-2 px-4 rounded"
          >
            <TrolleyIcon className="w-6 h-6" />

            {/* TODO span item count once global state is implemented */}

            <span className="hidden sm:block">My Basket</span>
          </Link>

          {/* User Area */}
          <ClerkLoaded>
            {user && (
              <Link
                href={"/orders"}
                className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                <PackageIcon className="w-6 h-6" />
                <span className="hidden sm:block">My Orders</span>
              </Link>
            )}

            {user ? (
              <div className="flex items-center space-x-2">
                <UserButton />
                <div className="hidden sm:block text-xs">
                  <p className="text-gray-400">Welcome Back</p>
                  <p className="font-bold">{user.fullName}!</p>
                </div>
              </div>
            ) : (
              <SignInButton mode="modal" />
            )}
          </ClerkLoaded>
        </div>
      </div>
    </header>
  );
};

export default Header;
