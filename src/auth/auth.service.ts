import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { EncryptionService } from 'src/encryption/encryption.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { FindUserDto } from 'src/users/dto/find-user.dto';
import { User } from "src/users/entities/user.entity";
import { UserErrorCodes } from 'src/users/interfaces/users.interfaces';
import { UsersService } from 'src/users/users.service';
import { constants } from './constants';

@Injectable()
export class AuthService {
	constructor(
		@Inject(EncryptionService) private readonly encryptionService: EncryptionService,
		@Inject(JwtService) private readonly jwtService: JwtService,
		@Inject(ConfigService) private readonly configService: ConfigService,
		@Inject(UsersService) private readonly usersService: UsersService,
	) { }

	private async createUser(createUserDto: CreateUserDto) {
		const user = await this.usersService.create(createUserDto);
		return user;
	}

	private async validateUserPassword(user: User, password: string) {
		const passwordHash = await this.encryptionService.compare(password, user.hash);
		if (!passwordHash) throw new HttpException(UserErrorCodes.USER_PASSWORD_INCORRECT, HttpStatus.UNAUTHORIZED);

		return passwordHash;
	}

	private async validateToken(token: string, isRefreshToken: boolean = false) {
		if (isRefreshToken) {
			return !!this.jwtService.verifyAsync(token, { secret: this.configService.get('REFRESH_JWT_SECRET') });
		}

		return !!this.jwtService.verifyAsync(token, { secret: this.configService.get('JWT_SECRET') });
	}

	async register(createUserDto: CreateUserDto) {
		const tokens = await this.getTokens(createUserDto.username);
		const user = await this.createUser({ ...createUserDto, refresh_token: tokens.refreshToken });

		return { user, token: tokens.accessToken };
	}

	async login(findUserDto: FindUserDto) {
		const foundUser = await this.usersService.findOneWithHash({ username: findUserDto.username });
		await this.validateUserPassword(foundUser, findUserDto.password);

		const tokens = await this.getTokens(foundUser.username);
		const updatedWithRefreshTokenUser = await this.usersService.update({ username: foundUser.username }, { refresh_token: tokens.refreshToken });

		return { user: updatedWithRefreshTokenUser, token: tokens.accessToken };
	}

	async validate(token: string, username: string) {
		if (!await this.usersService.exists({ username })) {
			throw new HttpException(UserErrorCodes.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
		};

		return await this.validateToken(token);
	}

	async refresh(token: string, username: string) {
		if (!token) throw new HttpException(UserErrorCodes.TOKEN_NOT_PROVIDED, HttpStatus.UNAUTHORIZED);
		if (!username) throw new HttpException(UserErrorCodes.USERNAME_NOT_PROVIDED, HttpStatus.UNAUTHORIZED);

		const IS_REFRESH_TOKEN = true;
		const isValid = await this.validateToken(token, IS_REFRESH_TOKEN);
		if (!isValid) throw new HttpException(UserErrorCodes.TOKEN_INVALID, HttpStatus.UNAUTHORIZED);

		const user = await this.usersService.findOne({ username });
		if (!user) throw new HttpException(UserErrorCodes.USER_NOT_FOUND, HttpStatus.NOT_FOUND);

		const tokens = await this.getTokens(username);
		await this.usersService.update({ username: username }, { refresh_token: tokens.refreshToken });

		return { token: tokens.accessToken, user };
	}

	async logout(id: string, request: Request) {
		if (request.user) {
			const user = request.user as User;
			if (user._id !== id) throw new HttpException(UserErrorCodes.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
			request.user = null;
		}

		return { message: constants.messages.REMOVE_FROM_STORAGE };
	}

	async getTokens(username: string) {
		const accessToken = await this.jwtService.signAsync({ username }, { expiresIn: this.configService.get(constants.config.JWT_EXPIRATION_KEY), secret: this.configService.get(constants.config.JWT_SECRET_KEY) });
		const refreshToken = await this.jwtService.signAsync({ username }, { expiresIn: this.configService.get(constants.config.REFRESH_JWT_EXPIRATION_KEY), secret: this.configService.get(constants.config.REFRESH_JWT_SECRET_KEY) });

		return { accessToken, refreshToken };
	}
}
