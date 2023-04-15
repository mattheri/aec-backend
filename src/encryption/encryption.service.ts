import { Injectable } from '@nestjs/common';
import { compare, hash, genSalt } from 'bcrypt';
import crypto from "crypto";

@Injectable()
export class EncryptionService {
	private readonly saltRounds: number = 10;

	async hash(data: string) {
		const salt = await genSalt(this.saltRounds);
		return hash(data, salt);
	}

	async compare(data: string, encrypted: string) {
		return compare(data, encrypted);
	}
}
