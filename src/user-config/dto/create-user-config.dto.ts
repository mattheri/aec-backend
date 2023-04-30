import { IsIn, IsOptional, IsString } from 'class-validator';
import {
  DefaultDateFilter,
  DefaultSort,
} from '../interfaces/user-config.interface';

export const defaultSorts = [
  'date:asc',
  'date:desc',
  'amount:asc',
  'amount:desc',
] as const;
export const defaultDateFilters = ['month', 'week'] as const;

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
