import { create } from "zustand";
import type { Collection, Token, ExportFormat } from "../shared/types";

type Settings = {
  useOklch: boolean;
  hexFallback: boolean;
  prefix: string;
  includeComments: boolean;
  sortTokens: boolean;
};

type Store = {
  collections: Collection[];
  selectedCollectionIds: string[];
  activeModeId: string | null;
  tokens: Token[];
  format: ExportFormat;
  settings: Settings;
  generatedCode: string;

  setCollections: (c: Collection[]) => void;
  toggleCollection: (id: string) => void;
  setActiveModeId: (id: string) => void;
  setTokens: (t: Token[]) => void;
  setFormat: (f: ExportFormat) => void;
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  setGeneratedCode: (code: string) => void;
};

export const useStore = create<Store>((set) => ({
  collections: [],
  selectedCollectionIds: [],
  activeModeId: null,
  tokens: [],
  format: "tailwind",
  settings: {
    useOklch: true,
    hexFallback: false,
    prefix: "--",
    includeComments: true,
    sortTokens: false,
  },
  generatedCode: "",

  setCollections: (collections) =>
    set({
      collections,
      selectedCollectionIds: collections.map((c) => c.id),
    }),
  toggleCollection: (id) =>
    set((s) => ({
      selectedCollectionIds: s.selectedCollectionIds.includes(id)
        ? s.selectedCollectionIds.filter((x) => x !== id)
        : [...s.selectedCollectionIds, id],
    })),
  setActiveModeId: (activeModeId) => set({ activeModeId }),
  setTokens: (tokens) => set({ tokens }),
  setFormat: (format) => set({ format }),
  updateSetting: (key, value) =>
    set((s) => ({ settings: { ...s.settings, [key]: value } })),
  setGeneratedCode: (generatedCode) => set({ generatedCode }),
}));