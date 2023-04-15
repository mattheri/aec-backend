import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
	@IsEmail()
	username: string;
	name?: string;
	@IsNotEmpty()
	password: string;
	refresh_token?: string;
	createdAt?: Date;
	updatedAt?: Date;
}
