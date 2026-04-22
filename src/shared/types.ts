export type TokenType = "COLOR" | "FLOAT" | "STRING" | "BOOLEAN";

export type Token = {
  name: string;
  value: string;
  rawValue: string | number | object;
  type: TokenType;
  collection: string;
  mode: string;
};

export type Collection = {
  id: string;
  name: string;
  modes: { modeId: string; name: string }[];
  tokenCount: number;
};

export type ExportFormat = "tailwind" | "w3c";

export type PluginMessage =
  | { type: "COLLECTIONS_LOADED"; collections: Collection[] }
  | { type: "TOKENS_LOADED"; tokens: Token[] }
  | { type: "ERROR"; message: string };

export type UIMessage =
  | { type: "GET_COLLECTIONS" }
  | { type: "GET_TOKENS"; collectionIds: string[]; modeId: string }
  | { type: "EXPORT_TOKENS"; collectionIds: string[]; modeId: string; format: ExportFormat };   