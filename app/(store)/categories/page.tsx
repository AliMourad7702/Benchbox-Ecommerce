// app/categories/page.tsx

import { getAllCategories } from "@/sanity/lib/categories/getAllCategories";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-static";
export const revalidate = 1800;

// TODO add filter component here to select between certain categories (as statuses like chairs / desks / workstations and more categories)

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {categories.map((category) => (
        <Link
          key={category._id}
          href={`/category/${category.slug}`}
          className="group border rounded-lg overflow-hidden hover:shadow-lg transition bg-white"
        >
          <div className="relative w-full h-48">
            <Image
              src={category.imageUrl!}
              alt={category.title!}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-1 group-hover:text-blue-600">
              {category.title}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  );
}
