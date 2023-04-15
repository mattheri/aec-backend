export type IncomeRecursion = {
	from: Date;
	to: Date;
	period: number;
}

export class Income {
	_id: string;
	description: string;
	amount: number;
	date: Date;
	isRecurring: boolean;
	recursion?: IncomeRecursion;
	user: string;
	archived: boolean;
}

export type Sort = "date:asc" | "date:desc" | "amount:asc" | "amount:desc";

export type IncomeQueryFilter = {
	limit?: number;
	offset?: number;
	sort?: Sort;
}