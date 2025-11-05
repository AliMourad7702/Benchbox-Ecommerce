import React, { ReactNode } from "react";

export function transformTextNodes(
  children: ReactNode,
  transformFn: (t: string) => string
): ReactNode {
  if (!children) return null;

  // Children can be a string, element, or array — normalize to array
  const arrayChildren = Array.isArray(children) ? children : [children];

  return arrayChildren.map((child, index) => {
    // ✅ Case 1: plain string node
    if (typeof child === "string") {
      return transformFn(child);
    }

    // ✅ Case 2: valid React element (with or without children)
    if (React.isValidElement(child)) {
      const nested = (child.props as any)?.children;

      // If element has children → recursively transform them
      if (nested) {
        return React.cloneElement(
          child,
          { key: index },
          transformTextNodes(nested, transformFn)
        );
      }

      // Element without children → return as-is
      return React.cloneElement(child, { key: index });
    }

    // ✅ Case 3: anything else (null, number, etc.)
    return child;
  });
}

export const toLower = (t: string) => t.toLowerCase();
