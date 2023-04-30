import { IsIn, IsOptional, IsString } from 'class-validator';
import {
  DefaultDateFilter,
  DefaultSort,
} from '../interfaces/user-config.interface';

const defaultSorts = [
  'dateAsc',
  'dateDesc',
  'amountAsc',
  'amountDesc',
] as const;
const defaultDateFilters = ['month', 'week'] as const;

export class CreateUserConfigDto {
  @IsString()
  @IsOptional()
  user: string;
  @IsIn(defaultSorts)
  @IsOptional()
  defaultSort?: DefaultSort;
  @IsIn(defaultDateFilters)
  @IsOptional()
  defaultDateFilter?: DefaultDateFilter;
}
