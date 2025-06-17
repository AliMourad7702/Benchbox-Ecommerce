import { useEffect, useState } from "react";
import { useFormValue } from "sanity";
import { TextInput, Stack, Card, Text } from "@sanity/ui";
import { PatchEvent, set, setIfMissing } from "sanity";
import { client } from "@/sanity/lib/client";
import { defineQuery } from "next-sanity";

export default function SanityAutoSlugInput(props: any) {
  const { onChange, elementProps, schemaType } = props;

  const sourceField = schemaType?.options?.source;

  const source = useFormValue([`${sourceField}`]) as string;
  const doc = useFormValue([]) as { _type: string; _id: string };

  console.log("doc._id", doc._id);

  const [generatedSlug, setGeneratedSlug] = useState("");

  useEffect(() => {
    if (!source || !sourceField) return;

    let isMounted = true;

    const generateUniqueSlug = async () => {
      const baseSlug = source
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^\w\-]+/g, "")
        .replace(/--+/g, "-")
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
      console.log("existingSlugs: ", existingSlugs);

      let uniqueSlug = baseSlug;
      let counter = 1;

      while (existingSlugs.includes(uniqueSlug)) {
        uniqueSlug = `${baseSlug}-${counter++}`;
      }

      if (!isMounted) return;

      if (uniqueSlug !== generatedSlug) {
        setGeneratedSlug(uniqueSlug);
        onChange(PatchEvent.from([set({ current: uniqueSlug })]));
      }
    };

    generateUniqueSlug();
    return () => {
      isMounted = false;
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
