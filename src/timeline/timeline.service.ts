import { Injectable } from '@nestjs/common';
import {
  Expense,
  ExpenseQueryFilter,
  Sort,
} from 'src/expenses/entities/expense.entity';
import { Income, IncomeQueryFilter } from 'src/incomes/entities/income.entity';
import { addDays, getDate, differenceInDays } from 'date-fns';

@Injectable()
export class TimelineService {
  offset: number;
  limit: number;
  sort: Sort;

  private getRecursionTime<T extends Expense | Income>(item: T): number {
    const { period, to, from } = item.recursion;

    const startingPoint = from;
    const endingPoint = to;
    return differenceInDays(endingPoint, startingPoint) / period;
  }

  repeat<
    T extends (Expense | Income)[],
    K extends IncomeQueryFilter | ExpenseQueryFilter,
  >(items: T, { sort, limit, offset }: K) {
    const newItems: (Expense | Income)[] = [];

    for (const item of items) {
      if (item.isRecurring) {
        const times = this.getRecursionTime(item);
        for (let i = 0; i < times; i++) {
          if (offset && i < offset) continue;
          if (limit && i > limit) break;

          const newItem = { ...item, _id: item._id.toString() };
          (newItem.date = addDays(
            newItem.date,
            newItem.recursion.period * i,
          ).getTime()),
            newItems.push(newItem);
          if (sort) {
            if (sort === 'date:asc') {
              newItems.sort((a, b) => a.date - b.date);
            } else if (sort === 'date:desc') {
              newItems.sort((a, b) => b.date - a.date);
            }
          }
        }
      }
    }

    return newItems as T;
  }
}
