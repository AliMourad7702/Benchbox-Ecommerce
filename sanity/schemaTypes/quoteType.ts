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
      weak: true,
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
        // TODO remove the country field because its not necessary (the shop is local)
        {
          name: "country",
          title: "Country (Optional)",
          type: "string",
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
            // Reference
            defineField({
              name: "variant",
              title: "Selected Variant (Reference)",
              type: "reference",
              to: [{ type: "variant" }],
              weak: true,
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "quantity",
              title: "Quantity Requested",
              type: "number",
              validation: (Rule) => Rule.required().min(1),
            }),
            {
              name: "itemTotal",
              title: "Item Total (Price x Quantity)",
              type: "number",
              readOnly: true,
            },
            // Snapshot fields
            defineField({
              name: "productId",
              title: "Product ID",
              type: "string",
              readOnly: true,
            }),
            defineField({
              name: "productName",
              title: "Product Name",
              type: "string",
              readOnly: true,
            }),
            defineField({
              name: "productSlug",
              title: "Product Slug",
              type: "string",
              readOnly: true,
            }),
            defineField({
              name: "baseSku",
              title: "Product Base SKU",
              type: "string",
              readOnly: true,
            }),
            defineField({
              name: "variantLabel",
              title: "Variant Label",
              type: "string",
              readOnly: true,
            }),
            defineField({
              name: "variantSku",
              title: "Variant SKU",
              type: "string",
              readOnly: true,
            }),
            defineField({
              name: "color",
              title: "Color Details (Snapshot)",
              type: "object",
              readOnly: true,
              fields: [
                { name: "colorName", title: "Color Name", type: "string" },
                { name: "colorCode", title: "Color Code", type: "string" },
                {
                  name: "images",
                  title: "Color Images",
                  type: "array",
                  of: [{ type: "url" }],
                  validation: (Rule) => Rule.min(1),
                },
                defineField({
                  name: "variantPrice",
                  title: "Variant Price (Snapshot)",
                  type: "number",
                  readOnly: true,
                }),
                {
                  name: "stock",
                  title: "Color Stock at Time of Request",
                  type: "number",
                },
                defineField({
                  name: "specs",
                  title: "Specifications (Snapshot)",
                  type: "array",
                  of: [{ type: "block" }],
                  readOnly: true,
                }),
              ],
            }),
          ],
          preview: {
            select: {
              sku: "variantSku",
              quantity: "quantity",
              price: "variantPrice",
              color: "color.colorName",
            },
            prepare({ sku, quantity, price, color }) {
              const total =
                price && quantity ? (price * quantity).toFixed(2) : "0.00";
              return {
                title: `${sku || "Unknown SKU"} x ${quantity}`,
                subtitle: `SAR ${price?.toFixed(2) || "0.00"} each · Total: SAR ${total} · Color: ${color || "N/A"}`,
              };
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "totalPrice",
      title: "Total Quotation Price (Snapshot)",
      type: "number",
      readOnly: true,
      description:
        "Automatically calculated: sum of all requested items at time of submission.",
    }),

    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: ["received", "under reviewing", "accepted", "declined"],
        layout: "dropdown",
      },
      initialValue: "received",
    }),
    defineField({
      name: "createdAt",
      title: "Created At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      name: "name",
      email: "email",
      total: "totalPrice",
      status: "status",
      isGuest: "isGuest",
    },
    prepare({ name, email, total, status, isGuest }) {
      const statusIcons = {
        received: "📥",
        "under reviewing": "🔍",
        accepted: "✅",
        declined: "❌",
      };

      const statusIcon =
        statusIcons[status as keyof typeof statusIcons] || "⏳";
      return {
        title: `${isGuest ? "Guest" : name} — SAR ${total?.toFixed(2) || "0.00"}`,
        subtitle: `${statusIcon} ${status} • ${email}`,
      };
    },
  },
});
