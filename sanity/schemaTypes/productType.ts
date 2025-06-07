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
      options: {
        source: "baseSku",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
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
              name: "stock",
              title: "Stock",
              type: "number",
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: "image",
              title: "Variant Image(s)",
              type: "array",
              of: [
                {
                  type: "image",
                  options: {
                    hotspot: true,
                  },
                  validation: (Rule) => Rule.required(),
                },
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "baseSku",
      media: "variants.0.image.0.asset",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title,
        subtitle: subtitle,
        media: media,
      };
    },
  },
});
