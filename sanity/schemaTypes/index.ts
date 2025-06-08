import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { postType } from "./postType";
import { authorType } from "./authorType";
import { productType } from "./productType";
import { userType } from "./userType";
import { quoteType } from "./quoteType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, productType, userType, quoteType],
};
