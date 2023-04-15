import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { constants } from 'src/auth/constants';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService, private reflector: Reflector) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);

		if (!token) {
			throw new UnauthorizedException();
		}
		try {
			const payload = await this.jwtService.verifyAsync(
				token,
				{ secret: process.env.JWT_SECRET, ignoreExpiration: true }
			);
			if (this.isTokenExpired(payload)) {
				throw new UnauthorizedException(constants.messages.TOKEN_EXPIRED);
			}
			request['user'] = payload;
		} catch (e) {
			const error = e as UnauthorizedException;
			throw new UnauthorizedException(
				error.message === constants.messages.TOKEN_EXPIRED ?
					constants.messages.TOKEN_EXPIRED :
					constants.messages.UNOTHAUTORIZED
			);
		}
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}

	private isTokenExpired({ iat, exp }: { iat: number, exp: number }): boolean {
		const now = new Date().getTime() / 1000;
		return now < iat || now > exp;
	}
}
