import { ListToken, Token } from "./tokens";

const getId = () => Math.round(Math.random() * 10 ** 8);

export const isTop = (token: Token): boolean => token.id === 0;

export const parse = (input: string) => {
  let index = 0;
  let line = 0;
  let localIndex = 0;

  const total: ListToken = {
    type: "list",
    value: [],
    line,
    id: 0,
    index: localIndex,
    parent: undefined
  };

  let current = total;

  while (index < input.length) {
    const char = input[index];
    if (char === "(") {
      const lastCurrent = current;
      current = {
        type: "list",
        line,
        id: getId(),
        parent: lastCurrent,
        value: [],
        index: localIndex
      };
      lastCurrent.value.push(current);
    } else if (char === ")") {
      if (current.parent) {
        current = current.parent;
      } else {
        throw new Error("Unmatched delimited");
      }
    } else if (char === "\n") {
      line++;
      localIndex = 0;
    } else {
      let token = "";
      while (
        index < input.length &&
        [" ", "\n", "(", ")"].indexOf(input[index]) === -1
      ) {
        token = token + input[index];
        index++;
        localIndex++;
      }
      if (token.length) {
        if (token.startsWith('"') && token.endsWith('"')) {
          current.value.push({
            type: "string",
            value: token.slice(1).slice(0, token.length - 2),
            line,
            parent: current,
            id: getId(),
            index: localIndex
          });
        } else if (!isNaN(Number(token))) {
          current.value.push({
            type: "number",
            value: Number(token),
            line,
            parent: current,
            id: getId(),
            index: localIndex
          });
        } else {
          current.value.push({
            type: "identifier",
            value: token,
            parent: current,
            id: getId(),
            line,
            index: localIndex
          });
        }
      }

      if (input[index] === ")") {
        index--;
        localIndex--;
      }
    }

    index++;
    localIndex++;
  }

  if (current.parent) {
    throw new Error("Unmatched delimiter");
  }
  return total.value;
};
