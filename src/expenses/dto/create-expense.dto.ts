import { Exclude, Transform, Type, } from "class-transformer";
import { IsString, IsBoolean, ValidateIf, ValidateNested, IsNumber, IsDateString, IsOptional, Min, IsNotEmptyObject } from "class-validator";

export class CreateExpenseRecursionDto {
	@IsDateString()
	from: Date;

	@IsDateString()
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

	@IsDateString()
	@IsOptional()
	date: Date;

	@IsBoolean()
	@IsOptional()
	isRecurring: boolean;

	@ValidateIf((expense) => expense.isRecurring)
	@ValidateNested()
	@Type(() => CreateExpenseRecursionDto)
	@IsNotEmptyObject()
	@Transform(({ obj, value }) => obj.isRecurring ? value : undefined)
	recursion?: CreateExpenseRecursionDto;

	@IsBoolean()
	@IsOptional()
	archived: boolean;

	@IsString()
	user: string;
}
