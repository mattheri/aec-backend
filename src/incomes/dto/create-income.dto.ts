import { Type, } from "class-transformer";
import { IsString, IsBoolean, ValidateIf, ValidateNested, IsNumber, IsDateString, IsOptional, Min } from "class-validator";

export class CreateIncomeRecursionDto {
	@IsDateString()
	from: Date;

	@IsDateString()
	to: Date;

	@IsNumber()
	period: number;
}

export class CreateIncomeDto {
	@IsString()
	@IsOptional()
	description: string;

	@Type(() => Number)
	@IsNumber()
	@Min(0)
	amount: number;

	@IsDateString()
	@IsOptional()
	date: Date;

	@IsBoolean()
	@IsOptional()
	isRecurring: boolean;

	@ValidateIf((expense) => expense.isRecurring)
	@ValidateNested()
	recursion?: CreateIncomeRecursionDto;

	@IsBoolean()
	@IsOptional()
	archived: boolean;

	@IsString()
	user: string;
}
