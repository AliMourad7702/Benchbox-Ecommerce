import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Benchbox Ecommerce CMS")
    .items([
      S.documentTypeListItem("category"),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !["category"].includes(item.getId()!)
      ),
    ]);
