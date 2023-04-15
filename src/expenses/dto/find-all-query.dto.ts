import { IsEnum, IsNumber, IsOptional, Min } from "class-validator";
import { Sort } from "../entities/expense.entity";
import { Type } from "class-transformer";

export class FindAllQueryDto {
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	@IsOptional()
	limit?: number;

	@Type(() => Number)
	@IsNumber()
	@Min(0)
	@IsOptional()
	offset?: number;

	@IsEnum(["date:asc", "date:desc", "amount:asc", "amount:desc"], {
		message: "Sort must be one of the following: date:asc, date:desc, amount:asc, amount:desc",
	})
	@IsOptional()
	sort?: Sort;
}