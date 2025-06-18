import { defineArrayMember, defineField, defineType } from "sanity";

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
      type: "array",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required().min(1),
    }),
    // TODO move the "stock" field inside the array of colorOptions objects and run the typegen command
    // FIXME after running the command, enjoy fixing errors :)
    defineField({
      name: "stock",
      title: "Stock",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "colorOptions",
      title: "Color Options",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "colorImagePair",
          title: "Color + Image",
          fields: [
            defineField({
              name: "colorName",
              title: "Color Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "color",
              title: "Color",
              type: "color",
              options: {
                disableAlpha: true,
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "images",
              title: "Images",
              type: "array",
              of: [
                defineArrayMember({
                  type: "image",
                  options: {
                    hotspot: true,
                  },
                }),
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              title: "color.hex",
              media: "images.0.asset",
            },
            prepare({ title, media }) {
              return {
                title: title ? `Color ${title}` : "No Color",
                media,
              };
            },
          },
        }),
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
      media: "colorOptions.0.images.0.asset",
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
