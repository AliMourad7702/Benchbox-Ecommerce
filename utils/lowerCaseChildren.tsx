// utils/lowercaseChildren.tsx
import React from "react";

export function lowercaseChildren(children: any): any {
  if (!children) return null;

  return (
    <>
      {children.map((child: any, i: number) => {
        // ✅ Case 1: plain text
        if (typeof child === "string") {
          return child.toLowerCase();
        }

        // ✅ Case 2: element with nested children
        if (child?.props?.children) {
          const nested = Array.isArray(child.props.children)
            ? child.props.children
            : [child.props.children];

          return React.cloneElement(
            child,
            { key: i },
            lowercaseChildren(nested)
          );
        }

        // ✅ Case 3: element without children (rare)
        return React.cloneElement(child, { key: i });
      })}
    </>
  );
}
