export const sanitizeUserInput = (input: string): string => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  return input
    .trim()
    .replace(/<[^>]*>/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .slice(0, 255);
};

export const cleanUserData = (
  userData: Record<string, any>,
): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(userData)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeUserInput(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
};
