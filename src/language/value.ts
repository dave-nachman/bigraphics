import { Token } from "./tokens";

export interface ValueWithToken<V extends Value> {
  value: V;
  token: Token;
}
export interface Object {
  type: string;
  token: Token;
  params: ValueWithToken<Value>[];
  properties: Record<string, ValueWithToken<Value> | undefined>;
}

export interface Rect extends Object {
  type: "rect";
  token: Token;
  params: [ValueWithToken<number>,ValueWithToken<number>,ValueWithToken<number>,ValueWithToken<number>]
  properties: {
    fill: ValueWithToken<string> | undefined
  }
}

export type Value = Token["value"] | Rect;
export type Environment = Record<string, Value>;
