/**
 * Extracts variable names from a string containing {{variable_name}} syntax.
 */
export const extractVariables = (text: string): string[] => {
  const regex = /\{\{([^}]+)\}\}/g;
  const matches = [...text.matchAll(regex)];
  return Array.from(new Set(matches.map(match => match[1].trim())));
};
