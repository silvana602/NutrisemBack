import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';

const COUNTRY = 'BOL';
const PER_PAGE = 20000;
const API_BASE = 'https://api.worldbank.org/v2';

const INDICATORS = [
  {
    seriesId: 'malnutrition',
    title: 'Desnutricion infantil',
    subtitle: 'Evolucion porcentual nacional',
    tone: 'secondary' as const,
    indicator: 'SH.STA.STNT.ZS',
  },
  {
    seriesId: 'overweight',
    title: 'Sobrepeso infantil',
    subtitle: 'Evolucion porcentual nacional',
    tone: 'primary' as const,
    indicator: 'SH.STA.OWGH.ZS',
  },
];

type WorldBankEntry = {
  date: string;
  value: number | null;
};

type WorldBankResponse = [
  { page: number; pages: number; per_page: string; total: number },
  WorldBankEntry[],
];

const normalizeSeries = (entries: WorldBankEntry[], limit = 5) => {
  const filtered = entries
    .filter((item) => item.value !== null && Number.isFinite(item.value))
    .map((item) => ({
      year: item.date,
      value: Number(item.value),
    }))
    .sort((a, b) => Number(a.year) - Number(b.year));

  const sliced = filtered.slice(-limit);
  return {
    years: sliced.map((item) => item.year),
    values: sliced.map((item) => Number(item.value.toFixed(1))),
  };
};

@Controller('public/trends')
export class PublicTrendsController {
  @Get()
  async getTrends() {
    try {
      const seriesResults = await Promise.all(
        INDICATORS.map(async (config) => {
          const url = `${API_BASE}/country/${COUNTRY}/indicator/${config.indicator}?format=json&per_page=${PER_PAGE}`;
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error(`WorldBank ${config.indicator} ${response.status}`);
          }

          const payload = (await response.json()) as WorldBankResponse;
          const data = Array.isArray(payload?.[1]) ? payload[1] : [];
          const normalized = normalizeSeries(data);

          return {
            ...config,
            years: normalized.years,
            values: normalized.values,
          };
        })
      );

      const years = seriesResults[0]?.years ?? [];
      const series = seriesResults.map((item) => ({
        seriesId: item.seriesId,
        title: item.title,
        subtitle: item.subtitle,
        tone: item.tone,
        values: item.values,
      }));

      return {
        years,
        series,
        source:
          'World Bank (JME UNICEF/WHO/World Bank) - indicadores SH.STA.STNT.ZS y SH.STA.OWGH.ZS',
      };
    } catch (error: unknown) {
      throw new ServiceUnavailableException('No fue posible obtener tendencias');
    }
  }
}
