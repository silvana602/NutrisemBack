import { networkInterfaces } from 'os';

export const getFirstLanIpv4 = (): string | null => {
  const interfaces = networkInterfaces();

  for (const values of Object.values(interfaces)) {
    if (!values) {
      continue;
    }

    for (const info of values) {
      const isIpv4 = info.family === 'IPv4';
      if (isIpv4 && !info.internal) {
        return info.address;
      }
    }
  }

  return null;
};
