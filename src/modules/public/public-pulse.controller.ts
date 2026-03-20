import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Consultation, Diagnosis } from 'src/database/entities';

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const buildDeltaLabel = (current: number, previous: number) => {
  if (!previous) {
    return current > 0 ? 'Nuevo periodo' : 'Sin datos previos';
  }

  const delta = ((current - previous) / previous) * 100;
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta.toFixed(1)}% mensual`;
};

@Controller('public/pulse')
export class PublicPulseController {
  constructor(
    @InjectRepository(Consultation)
    private readonly consultationsRepository: Repository<Consultation>,
    @InjectRepository(Diagnosis)
    private readonly diagnosesRepository: Repository<Diagnosis>,
  ) {}

  @Get()
  async getPulseMetrics() {
    const now = new Date();
    const startCurrent = new Date(now);
    startCurrent.setDate(now.getDate() - 30);
    const startPrevious = new Date(now);
    startPrevious.setDate(now.getDate() - 60);

    const currentStartDate = formatDate(startCurrent);
    const previousStartDate = formatDate(startPrevious);

    const activeControls = await this.consultationsRepository
      .createQueryBuilder('consultation')
      .where('consultation.consultationDate >= :start', {
        start: currentStartDate,
      })
      .getCount();

    const previousControls = await this.consultationsRepository
      .createQueryBuilder('consultation')
      .where('consultation.consultationDate >= :previousStart', {
        previousStart: previousStartDate,
      })
      .andWhere('consultation.consultationDate < :currentStart', {
        currentStart: currentStartDate,
      })
      .getCount();

    const criticalThreshold = Number(process.env.CRITICAL_ZSCORE_THRESHOLD) || 10;

    const totalDiagnoses = await this.diagnosesRepository
      .createQueryBuilder('diagnosis')
      .where('diagnosis.createdAt >= :start', {
        start: startCurrent.toISOString(),
      })
      .getCount();

    const criticalAlerts = await this.diagnosesRepository
      .createQueryBuilder('diagnosis')
      .where('diagnosis.createdAt >= :start', {
        start: startCurrent.toISOString(),
      })
      .andWhere(
        new Brackets((qb) => {
          qb.where('CAST(diagnosis.z_score_percentile AS NUMERIC) <= :threshold', {
            threshold: criticalThreshold,
          })
            .orWhere('LOWER(diagnosis.nutritionalDiagnosis) LIKE :severe', {
              severe: '%sever%',
            })
            .orWhere('LOWER(diagnosis.nutritionalDiagnosis) LIKE :grave', {
              grave: '%grave%',
            })
            .orWhere('LOWER(diagnosis.nutritionalDiagnosis) LIKE :agudo', {
              agudo: '%agudo%',
            })
            .orWhere('LOWER(diagnosis.nutritionalDiagnosis) LIKE :critico', {
              critico: '%critico%',
            });
        }),
      )
      .getCount();

    const stabilizedPercent = totalDiagnoses
      ? Math.round(((totalDiagnoses - criticalAlerts) / totalDiagnoses) * 100)
      : 0;

    const deltaLabel = buildDeltaLabel(activeControls, previousControls);
    const deltaPercent = previousControls
      ? ((activeControls - previousControls) / previousControls) * 100
      : activeControls > 0
      ? 100
      : 0;

    return {
      updatedAt: now.toISOString(),
      windowDays: 30,
      metrics: [
        {
          metricId: 'active-controls',
          label: 'Controles activos',
          value: activeControls.toLocaleString('es-BO'),
          delta: deltaLabel,
          tone: deltaPercent > 0 ? 'up' : deltaPercent < 0 ? 'attention' : 'stable',
        },
        {
          metricId: 'critical-alerts',
          label: 'Alertas criticas',
          value: criticalAlerts.toLocaleString('es-BO'),
          delta: criticalAlerts > 0 ? 'Seguimiento en curso' : 'Sin alertas',
          tone: criticalAlerts > 0 ? 'attention' : 'stable',
        },
        {
          metricId: 'resolved-cases',
          label: 'Casos estabilizados',
          value: `${stabilizedPercent}%`,
          delta: totalDiagnoses > 0 ? 'Ultimos 30 dias' : 'Sin datos',
          tone: stabilizedPercent >= 90 ? 'up' : 'stable',
        },
      ],
    };
  }
}
