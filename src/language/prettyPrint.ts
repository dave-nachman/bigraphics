import { Token } from "./tokens";

export const prettyPrint = (token: Token | Token[]): string => {
  if (Array.isArray(token)) {
    return token.map(child => prettyPrint(child)).join("\n\n");
  } else {
    switch (token.type) {
      case "list": {
        return `(${token.value.map(child => prettyPrint(child)).join(" ")})`;
      }
      case "string": {
        return `"${token.value}"`;
      }
      default: {
        return String(token.value);
      }
    }
  }
};
