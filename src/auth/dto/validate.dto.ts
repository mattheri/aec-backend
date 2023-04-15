import { IsEmail, IsString } from "class-validator";

export class ValidateDto {
	@IsEmail()
	username: string;
	@IsString()
	access_token: string;
}