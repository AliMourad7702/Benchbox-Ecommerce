import Link from "next/link";
import FooterList from "./FooterList";
import { getAllCategories } from "@/sanity/lib/categories/getAllCategories";
import { aboutUsText, companyMainEmail } from "@/utils/assets";

export const dynamic = "force-static";
export const revalidate = 1800;

const Footer = async () => {
  const categories = await getAllCategories();

  return (
    <footer className="bg-neutral-900 text-gray-300 text-sm mt-8">
      <div className="flex flex-col md:flex-row justify-between px-8 md:px-20 py-10">
        <FooterList
          type="category"
          title="Categories"
          links={categories}
        />
        <FooterList
          type="others"
          title="About Us"
          links={[
            {
              text: aboutUsText,
            },
          ]}
        />
        <FooterList
          type="others"
          title="Customer Service"
          links={[companyMainEmail]}
        />
      </div>
    </footer>
  );
};

export default Footer;
