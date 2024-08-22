export function parseDefinitions(definitionsString: string): string[] {
  // Remove the outer brackets
  const trimmed = definitionsString.trim().slice(1, -1);

  const result = [];
  let currentDefinition = '';
  let inQuotes = false;
  let quoteChar = '';

  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];

    if ((char === '"' || char === "'") && (!inQuotes || char === quoteChar)) {
      inQuotes = !inQuotes;
      if (inQuotes) quoteChar = char;
      continue;
    }

    if (char === ',' && !inQuotes) {
      result.push(currentDefinition.trim());
      currentDefinition = '';
      continue;
    }

    currentDefinition += char;
  }

  if (currentDefinition) {
    result.push(currentDefinition.trim());
  }

  return result;
}
