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
        { name: "city", title: "City", type: "string" },
        { name: "postalCode", title: "Postal Code", type: "string" },
        { name: "country", title: "Country", type: "string" },
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
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              validation: (Rule) => Rule.required(),
            },
            {
              name: "variantLabel",
              title: "Variant Label",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "quantity",
              title: "Quantity",
              type: "number",
              validation: (Rule) => Rule.required().min(1),
            },
          ],
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
