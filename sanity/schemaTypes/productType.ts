import SanityAutoSlugInput from "@/sanity/lib/components/SanityAutoSlugInput";
import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "product",
  title: "Products",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name (optional)",
      type: "string",
    }),
    defineField({
      name: "baseSku",
      title: "Base SKU / Model No.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      components: {
        input: SanityAutoSlugInput,
      },
      options: {
        source: "baseSku",
      },
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      weak: true,
      validation: (Rule) => Rule.required(),
    }),

    // ✅ NEW: Link to related variant documents
    defineField({
      name: "variants",
      title: "Variants",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "variant" }],
          weak: true,
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: "baseSku",
      subtitle: "name",
      media: "variants.0.colorOptions.0.images.0.asset",
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle,
        media,
      };
    },
  },
});
