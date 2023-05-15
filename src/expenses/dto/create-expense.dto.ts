import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  ValidateIf,
  ValidateNested,
  IsNumber,
  IsDateString,
  IsOptional,
  Min,
  IsNotEmptyObject,
} from 'class-validator';

export class CreateExpenseRecursionDto {
  @IsNumber()
  @Transform(({ value }) => {
    if (value && value instanceof Date) {
      return value.getTime();
    } else if (value && typeof value === 'string') {
      return new Date(value).getTime();
    }

    return value;
  })
  from: Date;

  @IsNumber()
  @Transform(({ value }) => {
    if (value && value instanceof Date) {
      return value.getTime();
    } else if (value && typeof value === 'string') {
      return new Date(value).getTime();
    }

    return value;
  })
  to: Date;

  @IsNumber()
  period: number;
}

export class CreateExpenseDto {
  @IsString()
  @IsOptional()
  description: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => {
    if (value && value instanceof Date) {
      return value.getTime();
    } else if (value && typeof value === 'string') {
      return new Date(value).getTime();
    }

    return value;
  })
  date: Date;

  @IsBoolean()
  @IsOptional()
  isRecurring: boolean;

  @ValidateIf((expense) => expense.isRecurring)
  @ValidateNested()
  @Type(() => CreateExpenseRecursionDto)
  @IsNotEmptyObject()
  @Transform(({ obj, value }) => (obj.isRecurring ? value : undefined))
  recursion?: CreateExpenseRecursionDto;

  @IsBoolean()
  @IsOptional()
  archived: boolean;

  @IsString()
  user: string;
}
