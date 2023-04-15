import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EncryptionModule } from 'src/encryption/encryption.module';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from 'src/guards/auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { RefreshJwtStrategy } from './refresh-jwt.strategy';

@Module({
  providers: [
    AuthService,
    {
      provide: "APP_GUARD",
      useClass: AuthGuard,
    },
    JwtStrategy,
    RefreshJwtStrategy,
  ],
  imports: [
    EncryptionModule,
    UsersModule,
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController]
})
export class AuthModule { }

