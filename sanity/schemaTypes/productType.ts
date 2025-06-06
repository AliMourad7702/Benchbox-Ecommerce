import { TrolleyIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const productType = defineType({
  name: "productType",
  title: "Product",
  type: "document",
  icon: TrolleyIcon,
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "baseSku",
      title: "Base SKU / Model No.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "categoryType" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "variants",
      title: "Product Variants",
      type: "array",
      of: [
        defineField({
          name: "variant",
          title: "Variant",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Variant Label (e.g. A, B)",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "sku",
              title: "Full SKU (e.g. CH-535A)",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "price",
              title: "Price (SAR)",
              type: "number",
              validation: (Rule) => Rule.required().positive(),
            }),
            defineField({
              name: "specs",
              title: "Specifications / Remarks",
              type: "text",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "image",
              title: "Variant Image",
              type: "image",
              options: {
                hotspot: true,
              },
              validation: (Rule) => Rule.required(),
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
});
