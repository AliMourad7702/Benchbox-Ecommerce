"use client";

import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const AuthClientWrapper = () => {
  const { user } = useUser();
  const userButtonRef = useRef<HTMLDivElement | null>(null);

  const handleUserButtonClick = () => {
    const button = userButtonRef.current?.querySelector(
      ".cl-userButtonTrigger"
    ) as HTMLElement | null;
    if (button) {
      button.click();
    }
  };

  return user ? (
    <div
      className="group relative flex items-center space-x-2 flex-1 sm:flex-2 justify-center lg:justify-start  rounded py-1 px-2  hover:cursor-pointer transition select-none"
      onClick={handleUserButtonClick}
    >
      <div
        className="group flex justify-center items-center"
        ref={userButtonRef}
        onClick={handleUserButtonClick}
      >
        <UserButton />
      </div>

      <div className=" text-xs">
        <p className="text-gray-300">Welcome Back</p>
        <p className="font-bold text-blue-500">{user.fullName}!</p>
      </div>
      {/* underline animation */}
      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 ease-in-out group-hover:w-full"></span>
    </div>
  ) : (
    <SignInButton>
      <Button className="group relative text-gray-300 text-sm md:text-base bg-neutral-900 hover:bg-neutral-900 font-bold py-5 px-4 rounded cursor-pointer!">
        Sign In
        {/* underline animation */}
        <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white transition-all duration-300 ease-in-out group-hover:w-full"></span>
      </Button>
    </SignInButton>
  );
};

export default AuthClientWrapper;
