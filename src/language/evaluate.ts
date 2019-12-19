import { Token } from "./tokens";
import { Value, Object, Environment, Rect } from "./value";

const evaluateOne = (
  token: Token,
  environment: Environment
): Value  => {
  switch (token.type) {
    case "list": {
      switch (token.value[0].value) {
        case "rect": {
          return {
            type: "rect",
            token,
            params: token.value.slice(1).map(child => ({
              value: evaluateOne(child, environment),
              token: child
            })),
            properties: {}
            // TODO: check this
          } as Rect;
        }
        case "fill": {
          const shape = evaluateOne(token.value[1], environment) as Object;
          return {
            ...shape,
            properties: {
              ...shape.properties,
              fill: {
                value: evaluateOne(token.value[2], environment),
                token: token.value[2]
              }
            }  
            // TODO: check this
          } as Rect;
        }
        case "def": {
          const value = evaluateOne(token.value[2], environment);
          environment[token.value[1].value as string] = value;
          return value;
        }
        case "export": {
          const value = evaluateOne(token.value[1], environment);

          environment[
            `$export__${Math.round(Math.random() * 10 ** 8)}`
          ] = value;

          return value;
        }
      }
    }

    case "number": {
      return token.value;
    }
    case "string": {
      return token.value;
    }
    case "identifier": {
      if (!environment[token.value]) {
        throw new Error(`${token.value} is not defined`);
      }
      return environment[token.value];
    }
  }
};

const evaluateToken = (token: Token, environment: Record<string, Value>) => {
  evaluateOne(token, environment);
  return environment;
};

export const evaluate = (tokens: Token[]): Environment => {
  const env = {};
  tokens.reduce((env, token) => evaluateToken(token, env), env);
  return env;
};
