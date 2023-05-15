import { Transform } from 'class-transformer';

export type IncomeRecursion = {
  from: number;
  to: number;
  period: number;
};

export class Income {
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
  description: string;
  amount: number;
  @Transform(({ value }) => new Date(value))
  date: number;
  isRecurring: boolean;
  recursion?: IncomeRecursion;
  user: string;
  archived: boolean;

  constructor(income: Partial<Income>) {
    const type = 'type' in income ? income.type : 'income';

    Object.assign(this, { ...income, type });
  }
}

export type Sort = 'date:asc' | 'date:desc' | 'amount:asc' | 'amount:desc';

export type IncomeQueryFilter = {
  limit?: number;
  offset?: number;
  sort?: Sort;
};

export enum IncomeErrorCodes {
  INCOME_NOT_FOUND = 'INCOME_NOT_FOUND',
}
