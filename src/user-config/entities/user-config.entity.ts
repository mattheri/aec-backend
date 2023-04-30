import { Transform } from 'class-transformer';
import { IsIn, IsString } from 'class-validator';
import {
  DefaultDateFilter,
  DefaultSort,
} from '../interfaces/user-config.interface';
import {
  defaultDateFilters,
  defaultSorts,
} from '../dto/create-user-config.dto';

export class UserConfig {
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
  @IsString()
  user: string;
  @IsIn(defaultSorts)
  defaultSort: DefaultSort;
  @IsIn(defaultDateFilters)
  defaultDateFilter: DefaultDateFilter;

  constructor(partial: Partial<UserConfig>) {
    Object.assign(this, partial);
  }
}
