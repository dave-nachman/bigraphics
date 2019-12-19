import _ from "lodash";
import { isTop as isRoot } from "./parser";
import { Token } from "./tokens";

const flatten = (tokens: Token[]): Token[] => {
  return tokens.flatMap(token =>
    token.type === "list"
      ? ([token].concat(flatten(token.value) as any) as Token[])
      : ([token] as Token[])
  );
};

const getEndOfListCount = (token: Token): number => {
  if (
    token.parent &&
    !isRoot(token.parent) &&
    token.parent.value.slice(-1)[0].id === token.id
  ) {
    return 1 + getEndOfListCount(token.parent!);
  } else {
    return 0;
  }
};

export const reprint = (tokens: Token[]) => {
  const flattened = flatten(tokens);

  const lines = _.chain(flattened)
    .groupBy(token => token.line)
    .mapValues(tokens => _.sortBy(tokens, token => token.index))
    .toPairs()
    .sortBy(([line]) => line)
    .map(
      ([line, tokens]) =>
        [
          Number(line),
          tokens
            .map((token, index) => {
              // if it's the first token in the line, get the existing amount of indent
              const indent = _.range(0, index === 0 ? token.index - 1 : 0)
                .map(n => " ")
                .join("");

              if (token.type === "list") {
                return indent + "(";
              } else {
                // get how
                const endOfListCount = getEndOfListCount(token);
                const value =
                  token.type === "string"
                    ? `"${token.value}"`
                    : String(token.value);
                if (endOfListCount) {
                  const endParens = _.range(0, endOfListCount)
                    .map(n => ")")
                    .join("");
                  return `${indent}${value}${endParens}`;
                } else {
                  return `${indent}${value} `;
                }
              }
            })
            .join("")
        ] as const
    )
    .value();

  const maxLine = lines.slice(-1)[0][0];

  return _.range(0, maxLine + 1)
    .map(index => {
      const match = lines.find(([line]) => index === line);
      if (match) {
        return match[1];
      } else {
        return "";
      }
    })
    .join("\n");
};
