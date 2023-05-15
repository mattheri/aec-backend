import { Transform } from 'class-transformer';

export type ExpenseRecursion = {
  from: number;
  to: number;
  period: number;
};

export class Expense {
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
  description: string;
  amount: number;
  @Transform(({ value }) => new Date(value))
  date: number;
  isRecurring: boolean;
  recursion?: ExpenseRecursion;
  user: string;
  archived: boolean;

  constructor(expense: Partial<Expense>) {
    const type = 'type' in expense ? expense.type : 'expense';
    Object.assign(this, { ...expense, type });
  }
}

export type Sort = 'date:asc' | 'date:desc' | 'amount:asc' | 'amount:desc';

export type ExpenseQueryFilter = {
  limit?: number;
  offset?: number;
  sort?: Sort;
};
