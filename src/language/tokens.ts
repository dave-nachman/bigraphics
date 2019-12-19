interface BaseToken {
  id: number;
  line: number;
  index: number;
  parent?: ListToken;
}

export interface ListToken extends BaseToken {
  type: "list";
  value: Token[];
}
export interface StringToken extends BaseToken {
  type: "string";
  value: string;
}
export interface IdentifierToken extends BaseToken {
  type: "identifier";
  value: string;
}
export interface NumberToken extends BaseToken {
  type: "number";
  value: number;
}
export type Token = ListToken | StringToken | IdentifierToken | NumberToken;
