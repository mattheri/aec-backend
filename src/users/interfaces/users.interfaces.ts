import { User as UserEntity } from "../entities/user.entity";

export interface FindOneUserArguments {
	username?: string;
	_id?: string;
}

export const UserErrorCodes = {
	USER_NOT_FOUND: 'USER_NOT_FOUND',
	USER_ALREADY_EXISTS: 'USER_ALREADY_EXISTS',
	USER_PASSWORD_INCORRECT: 'USER_PASSWORD_INCORRECT',
	TOKEN_NOT_PROVIDED: 'TOKEN_NOT_PROVIDED',
	USERNAME_NOT_PROVIDED: 'USERNAME_NOT_PROVIDED',
	TOKEN_INVALID: 'TOKEN_INVALID',
	NO_ID_OR_USERNAME: 'NO_ID_OR_USERNAME_PROVIDED',
	NO_ID_PROVIDED: 'NO_ID_PROVIDED',
}

export type User = UserEntity;
