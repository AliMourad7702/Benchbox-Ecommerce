import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { productType } from "./productType";
import { userType } from "./userType";
import { quoteType } from "./quoteType";
import { variantType } from "./variantType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    productType,
    variantType,
    userType,
    quoteType,
  ],
};
