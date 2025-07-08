"use client";

import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const AuthClientWrapper = () => {
  const { user } = useUser();

  return user ? (
    <div className="flex items-center space-x-2 flex-1 sm:flex-2 justify-center sm:justify-start bg-white rounded py-1 px-2">
      <UserButton />
      <div className=" text-xs">
        <p className="text-slate-800">Welcome Back</p>
        <p className="font-bold text-blue-500">{user.fullName}!</p>
      </div>
    </div>
  ) : (
    <SignInButton mode="modal">
      <Button className="text-white text-sm md:text-base bg-blue-500 hover:bg-blue-700 hover:opacity-50 font-bold py-5 px-4 rounded cursor-pointer!">
        Sign In
      </Button>
    </SignInButton>
  );
};

export default AuthClientWrapper;
