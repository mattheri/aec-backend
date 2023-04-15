import { Injectable } from "@nestjs/common";
import { ThrottlerException, ThrottlerGuard } from "@nestjs/throttler";

@Injectable()
export class TtlThrottlerGuard extends ThrottlerGuard {
	protected throwThrottlingException(): void {
		throw new ThrottlerException(`Too many requests, please try again in 10 seconds.`);
	}
}