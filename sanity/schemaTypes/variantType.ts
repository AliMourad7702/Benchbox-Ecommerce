import { defineField, defineType } from "sanity";

export const variantType = defineType({
  name: "variant",
  title: "Product Variant",
  type: "document",
  icon: () => "📦",
  fields: [
    defineField({
      name: "label",
      title: "Variant Label (e.g. A, B)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sku",
      title: "Full SKU",
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
      name: "images",
      title: "Variant Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "product",
      title: "Parent Product",
      type: "reference",
      to: [{ type: "product" }],
    }),
  ],
  preview: {
    select: {
      title: "sku",
      subtitle: "label",
      media: "images.0.asset",
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
