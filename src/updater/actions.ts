export interface Update {
  type: "update";
  tokenId: number;
  value: any;
}

export type Action = Update;
