import { IsDateString, IsEnum, IsString, IsUUID } from 'class-validator';
import { ReportFormat } from 'src/database/enums';

export class CreateReportDto {
  @IsUUID()
  userId!: string;

  @IsString()
  reportType!: string;

  @IsEnum(ReportFormat)
  format!: ReportFormat;

  @IsString()
  analysisPeriod!: string;

  @IsDateString()
  generationDate!: string;
}
