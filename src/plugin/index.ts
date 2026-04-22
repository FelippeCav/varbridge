figma.showUI(__html__, { width: 340, height: 660, themeColors: true });

function loadTokens(collectionIds: string[], modeId: string) {
  const allVars = figma.variables.getLocalVariables();
  const tokens: any[] = [];

  for (const variable of allVars) {
    const ids = collectionIds;
    let found = false;
    for (let i = 0; i < ids.length; i++) {
      if (ids[i] === variable.variableCollectionId) { found = true; break; }
    }
    if (!found) continue;

    const collection = figma.variables.getVariableCollectionById(variable.variableCollectionId);
    if (!collection) continue;
    const mode = collection.modes.find((m) => m.modeId === modeId) ?? collection.modes[0];
    const rawValue = variable.valuesByMode[mode.modeId];
    if (rawValue === undefined) continue;
    tokens.push({
      name: variable.name,
      type: variable.resolvedType,
      rawValue,
      collection: collection.name,
      mode: mode.name,
      value: String(rawValue),
    });
  }

  figma.ui.postMessage({ type: "TOKENS_LOADED", tokens });
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === "UI_READY" || msg.type === "GET_COLLECTIONS") {
    const collections = figma.variables.getLocalVariableCollections();
    const result = collections.map((c) => ({
      id: c.id,
      name: c.name,
      modes: c.modes,
      tokenCount: c.variableIds.length,
    }));
    figma.ui.postMessage({ type: "COLLECTIONS_LOADED", collections: result });

    const allIds = collections.map(c => c.id);
    const firstModeId = collections[0]?.modes[0]?.modeId ?? "";
    if (allIds.length > 0 && firstModeId) {
      loadTokens(allIds, firstModeId);
    }
  }

  if (msg.type === "GET_TOKENS" || msg.type === "EXPORT_TOKENS") {
    const { collectionIds, modeId } = msg;
    loadTokens(collectionIds, modeId);
  }
};