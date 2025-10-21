import Link from "next/link";
import FooterList from "./FooterList";
import { getAllCategories } from "@/sanity/lib/categories/getAllCategories";

export const dynamic = "force-static";
export const revalidate = 1800;

const Footer = async () => {
  const categories = await getAllCategories();

  return (
    <footer className="bg-neutral-900 text-white text-sm mt-8">
      <div className="flex flex-col md:flex-row justify-between px-8 py-8">
        <FooterList
          type="category"
          title="Categories"
          links={categories}
        />
        {/* <FooterList
          type="mail"/> */}
      </div>
    </footer>
  );
};

export default Footer;
