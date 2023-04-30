import {
  DefaultDateFilter,
  DefaultSort,
} from '../interfaces/user-config.interface';

export class CreateUserConfigDto {
  user: string;
  defaultSort?: DefaultSort;
  defaultDateFilter?: DefaultDateFilter;
}
