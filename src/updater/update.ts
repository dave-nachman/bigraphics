import { Action } from "./actions";
import { Token } from "../language/tokens";

const updateOne = (token: Token, actions: Action[]): Token => {
  if (token.type === "list") {
    return {
      ...token,
      value: token.value.map(child => updateOne(child, actions))
    };
  }

  console.log("aa", token, actions);
  return actions
    .filter(action => action.tokenId === token.id)
    .reduce((token, action) => {
      console.log("t a", token, action);
      switch (action.type) {
        case "update": {
          return {
            ...token,
            value: action.value
          };
        }
      }
    }, token);
};

export const update = (tokens: Token[], actions: Action[]) =>
  tokens.map(token => updateOne(token, actions));
