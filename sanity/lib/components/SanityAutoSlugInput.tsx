import { client } from "@/sanity/lib/client";
import { Card, Stack, Text, TextInput } from "@sanity/ui";
import { useEffect, useState } from "react";
import { PatchEvent, set, useFormValue } from "sanity";

export default function SanityAutoSlugInput(props: any) {
  const { onChange, elementProps, schemaType } = props;

  const sourceField = schemaType?.options?.source;

  const source = useFormValue([`${sourceField}`]) as string;
  const doc = useFormValue([]) as { _type: string; _id: string };
  const currentSlug = useFormValue(["slug", "current"]) as string;

  console.log("doc._id", doc._id);

  const [generatedSlug, setGeneratedSlug] = useState("");

  useEffect(() => {
    if (!source || !sourceField || !doc?._id) return;

    let cancelled = false;

    console.log("Source:", source);

    const generateUniqueSlug = async () => {
      const baseSlug = source
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with dashes
        .replace(/[^a-z0-9\-]/g, "") // Keep lowercase letters, numbers, and dashes
        .replace(/--+/g, "-") // Replace multiple dashes with one
        .replace(/^-+|-+$/g, "") // Trim leading/trailing dashes
        .slice(0, 200);

      // GROQ query to fetch all matching slugs
      const query = `
        *[_type == $type && defined(slug.current) && slug.current match $slugPattern && _id != $id][].slug.current
      `;
      const params = {
        type: doc._type,
        id: doc._id.replace(/^drafts\./, ""),
        slugPattern: `${baseSlug}*`,
      };

      const existingSlugs = await client.fetch(query, params);

      let uniqueSlug = baseSlug;
      let counter = 1;

      while (existingSlugs.includes(uniqueSlug)) {
        uniqueSlug = `${baseSlug}-${counter++}`;
      }

      if (!cancelled) {
        setGeneratedSlug(uniqueSlug);

        if (onChange && typeof onChange === "function") {
          // Only patch if the document is a draft or in editable state
          if (doc._id?.startsWith("drafts.")) {
            onChange(PatchEvent.from([set({ current: uniqueSlug })]));
          } else {
            console.warn(
              "Slug not patched because document is not editable yet"
            );
          }
        }
      }
    };

    // Wrap in setTimeout to wait a frame before patching (lets Sanity load properly)
    const timeout = setTimeout(() => {
      generateUniqueSlug();
    }, 50);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [source]);

  return (
    <Stack space={2}>
      <Text
        size={1}
        muted
      >
        Auto-generated from{" "}
        <span
          style={{
            textDecoration: "underline",
          }}
        >
          {sourceField}
        </span>
      </Text>
      <Card
        tone="transparent"
        border
        radius={2}
        padding={2}
      >
        <TextInput
          value={generatedSlug}
          readOnly
          disabled
          {...elementProps}
        />
      </Card>
    </Stack>
  );
}
