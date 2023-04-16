import { Expense as ExpenseEntity, ExpenseRecursion as ExpenseRecursionEntity } from "../entities/expense.entity"

export type Expense = ExpenseEntity;
export type ExpenseRecursion = ExpenseRecursionEntity;

export enum ExpenseErrorCodes {
	EXPENSE_NOT_FOUND = 'EXPENSE_NOT_FOUND',
}