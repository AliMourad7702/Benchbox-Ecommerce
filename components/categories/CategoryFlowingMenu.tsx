import { ALL_CATEGORIES_QUERYResult } from "@/sanity.types";
import FlowingMenu from "../ui/FlowingMenu/FlowingMenu";

interface CategoryFlowingMenuProps {
  // Define the props for the CategorySelector component
  category: ALL_CATEGORIES_QUERYResult[0];
}

const CategoryFlowingMenu = ({ category }: CategoryFlowingMenuProps) => {
  return (
    <div className="relative w-full h-[6rem]">
      <FlowingMenu
        items={[
          {
            text: category!.title!,
            link: `/category/${category!.slug!}`,
            // TODO adjust the image to make it dynamic
            image: category.imageUrl,
          },
        ]}
      />
    </div>
  );
};

export default CategoryFlowingMenu;
