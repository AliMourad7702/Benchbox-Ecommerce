"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function CategoryPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fullPath = `${pathname}?${searchParams.toString()}`;
    localStorage.setItem("lastCategoryPath", fullPath);
  }, [pathname, searchParams]);

  return <>{children}</>;
}
