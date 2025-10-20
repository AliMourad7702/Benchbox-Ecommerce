import Link from "next/link";
import FooterList from "./FooterList";
import { getAllCategories } from "@/sanity/lib/categories/getAllCategories";

export const dynamic = "force-static";
export const revalidate = 1800;

const Footer = async () => {
  const categories = await getAllCategories();
  return (
    <footer className="bg-neutral-900 text-white text-sm mt-16">
      <div className="flex flex-col md:flex-row justify-between pt-16 pb-8">
        <FooterList>
          <h3>Categories</h3>
          {/*TODO map through all fetched categories here */}
        </FooterList>
      </div>
    </footer>
  );
};

export default Footer;
