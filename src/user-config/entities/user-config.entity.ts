import { Transform } from 'class-transformer';
import {
  DefaultDateFilter,
  DefaultSort,
} from '../interfaces/user-config.interface';

export class UserConfig {
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
  user: string;
  defaultSort: DefaultSort;
  defaultDateFilter: DefaultDateFilter;

  constructor(partial: Partial<UserConfig>) {
    Object.assign(this, partial);
  }
}
