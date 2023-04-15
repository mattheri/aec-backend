import { IsEmail, IsString } from "class-validator";

export class RefreshDto {
	@IsEmail()
	username: string;
	@IsString()
	refresh_token: string;
}