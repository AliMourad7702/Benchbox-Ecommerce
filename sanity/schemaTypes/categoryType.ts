import SanityAutoSlugInput from "@/sanity/lib/components/SanityAutoSlugInput";
import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Category Title",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      components: {
        input: SanityAutoSlugInput,
      },
      options: {
        source: "title",
      },
    }),
    defineField({
      name: "image",
      title: "Category Image (Optional)",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
    },
  },
});
