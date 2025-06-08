import { defineField, defineType } from "sanity";

export const userType = defineType({
  name: "user",
  title: "Users",
  type: "document",
  icon: () => "👤",
  fields: [
    defineField({
      name: "clerkId",
      title: "Clerk User ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
      options: {
        list: ["user", "admin", "manager"],
        layout: "dropdown",
      },
      initialValue: "user",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "joinedAt",
      title: "Joined At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
});
