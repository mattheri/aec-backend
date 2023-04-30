import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from '@nestjs/mongoose';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { IncomesModule } from './incomes/incomes.module';
import { AuthModule } from './auth/auth.module';
import { EncryptionModule } from './encryption/encryption.module';
import { TtlThrottlerGuard } from './guards/ttl-throttler.guard';
import { UserConfigModule } from './user-config/user-config.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule.register(),
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 10,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    UsersModule,
    ExpensesModule,
    IncomesModule,
    EncryptionModule,
    AuthModule,
    UserConfigModule,
  ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass: CacheInterceptor,
  }, {
      provide: APP_GUARD,
      useClass: TtlThrottlerGuard,
    }],
})
export class AppModule { }

