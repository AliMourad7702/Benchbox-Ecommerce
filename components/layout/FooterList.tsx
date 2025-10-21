import Link from "next/link";
import { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";
import { ReactNode } from "react";

interface OtherLink {
  label?: string;
  href: string;
  mail?: Boolean;
  icon?: ReactNode; // optional icon component
}

interface FooterListProps {
  title: string;
  links: ALL_CATEGORIES_QUERYResult | string[] | OtherLink[];
  type: "category" | "others";
}

const FooterList: React.FC<FooterListProps> = ({ title, links, type }) => {
  return (
    <div className="w-full sm:w-1/2 md:w-1/4 lg:w-1/6 mb-6 flex flex-col gap-2">
      <h3 className="font-semibold text-base mb-2.5">{title}</h3>
      <div className="flex flex-col gap-1.5 px-2">
        {type === "category" &&
          (links as ALL_CATEGORIES_QUERYResult).map((link) => {
            if (!link.slug) return null;
            return (
              <Link
                key={link._id}
                href={`/category/${link.slug}`}
                className="hover:underline capitalize"
              >
                {link.title || link.slug.replace(/-/g, " ")}
              </Link>
            );
          })}

        {type === "others" &&
          (links as OtherLink[]).map((link, index) => (
            <Link
              key={index}
              href={link.mail ? `mailto:${link.href}` : link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:underline capitalize"
            >
              {link.icon && <span className="text-lg">{link.icon}</span>}
              {link.label}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default FooterList;
