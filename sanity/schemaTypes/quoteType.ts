import { defineField, defineType } from "sanity";

export const quoteType = defineType({
  name: "quote",
  title: "Quotation Requests",
  type: "document",
  icon: () => "📝",
  fields: [
    defineField({
      name: "user",
      title: "Submitted By",
      type: "reference",
      to: [{ type: "user" }],
      description:
        "Optional — links to user document if submitted while logged in.",
    }),
    defineField({
      name: "isGuest",
      title: "Submitted by Guest?",
      type: "boolean",
      initialValue: true,
      readOnly: true,
    }),
    defineField({
      name: "name",
      title: "Customer Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Customer Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "object",
      fields: [
        {
          name: "line1",
          title: "Address Line 1",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        { name: "line2", title: "Address Line 2", type: "string" },
        {
          name: "city",
          title: "City",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "postalCode",
          title: "Postal Code",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
        {
          name: "country",
          title: "Country",
          type: "string",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: "notes",
      title: "Additional Notes",
      type: "text",
    }),
    defineField({
      name: "items",
      title: "Requested Items",
      type: "array",
      of: [
        defineField({
          name: "item",
          type: "object",
          fields: [
            {
              name: "variant",
              title: "Selected Variant",
              type: "reference",
              to: [{ type: "variant" }],
              validation: (Rule) => Rule.required(),
            },
            {
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule) => Rule.required().min(1),
            },
          ],
          preview: {
            select: {
              variantLabel: "variant.label",
              sku: "variant.sku",
              color: "variant.colorOptions.0.colorName",
              quantity: "quantity",
              price: "variant.price",
              media: "variant.colorOptions.0.images.0.asset",
            },
            prepare({ variantLabel, sku, quantity, media, price, color }) {
              return {
                title: `${sku} - ${variantLabel} x ${quantity}`,
                subtitle: `SAR ${price} - Color ${color}`,
                media,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: ["pending", "reviewed", "replied"],
        layout: "dropdown",
      },
      initialValue: "pending",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
});
