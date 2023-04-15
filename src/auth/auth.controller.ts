import { Body, ClassSerializerInterceptor, Controller, HttpCode, HttpStatus, Param, Post, Req, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FindUserDto } from 'src/users/dto/find-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Public } from 'src/decorators/public.decorator';
import { ValidateDto } from './dto/validate.dto';
import { RefreshDto } from './dto/refresh.dto';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Public()
	@HttpCode(HttpStatus.OK)
	@Post("login")
	async login(@Body() findUserDto: FindUserDto) {
		return this.authService.login(findUserDto);
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Public()
	@Post('register')
	async register(@Body() createUserDto: CreateUserDto) {
		return this.authService.register(createUserDto);
	}

	@Public()
	@HttpCode(HttpStatus.OK)
	@Post('validate')
	async validate(@Body() validateDto: ValidateDto) {
		const isValid = await this.authService.validate(validateDto.access_token, validateDto.username);

		return { isValid }
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Public()
	@HttpCode(HttpStatus.OK)
	@Post('refresh')
	async refresh(@Body() refreshDto: RefreshDto) {
		return await this.authService.refresh(refreshDto.refresh_token, refreshDto.username);
	}

	@HttpCode(HttpStatus.OK)
	@Post('logout')
	async logout(@Param('id') id: string, @Req() request: Request) {
		return this.authService.logout(id, request);
	}
}
