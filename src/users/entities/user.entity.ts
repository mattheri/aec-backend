import { Exclude, Transform } from "class-transformer";

export class User {
	@Transform(({ obj }) => obj._id.toString())
	_id: string;
	username: string;
	name: string;
	last_name: string;
	@Exclude()
	hash: string;
	refresh_token: string;
	createdAt: Date;
	updatedAt: Date;

	constructor(partial: Partial<User>) {
		Object.assign(this, partial);
	}
}
