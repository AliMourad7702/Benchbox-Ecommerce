import { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";
import FlowingMenu from "../ui/FlowingMenu/FlowingMenu";

interface CategorySelectorProps {
  // Define the props for the CategorySelector component
  category: ALL_CATEGORIES_QUERYResult[0];
}

const CategorySelector = ({ category }: CategorySelectorProps) => {
  return (
    <div className="relative w-full h-[6rem]">
      <FlowingMenu
        items={[
          {
            text: category!.title!,
            link: `/category/${category!.slug!}`,
            image: "/images/fabric-chair.png",
          },
        ]}
      />
    </div>
  );
};

export default CategorySelector;
