export const parseCookies = (header: string | undefined): Record<string, string> => {
  if (!header) return {};

  return header
    .split(';')
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .reduce<Record<string, string>>((acc, part) => {
      const [key, ...rest] = part.split('=');
      if (!key) return acc;
      const value = rest.join('=');
      acc[decodeURIComponent(key)] = decodeURIComponent(value ?? '');
      return acc;
    }, {});
};
