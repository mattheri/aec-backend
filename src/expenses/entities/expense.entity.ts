export type ExpenseRecursion = {
	from: Date;
	to: Date;
	period: number;
}

export class Expense {
	_id: string;
	description: string;
	amount: number;
	date: Date;
	isRecurring: boolean;
	recursion?: ExpenseRecursion;
	user: string;
	archived: boolean;
}

export type Sort = "date:asc" | "date:desc" | "amount:asc" | "amount:desc";

export type ExpenseQueryFilter = {
	limit?: number;
	offset?: number;
	sort?: Sort;
}
