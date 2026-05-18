/**
 * Utility functions for the application
 */

/**
 * Convert string to camel case
 */
export const toCamelCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
};

/**
 * Convert string to snake case
 */
export const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Check if value is a valid ObjectId
 */
export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Parse query parameters
 */
export const parseQueryParams = (query: any) => {
  const parsed: any = {};
  for (const key in query) {
    if (query[key] === 'true') parsed[key] = true;
    else if (query[key] === 'false') parsed[key] = false;
    else if (!isNaN(query[key])) parsed[key] = Number(query[key]);
    else parsed[key] = query[key];
  }
  return parsed;
};
