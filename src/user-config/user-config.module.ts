import { Module } from '@nestjs/common';
import { UserConfigService } from './user-config.service';
import { UserConfigController } from './user-config.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserConfig, UserConfigSchema } from './user-config.schema';

@Module({
  controllers: [UserConfigController],
  providers: [UserConfigService],
  imports: [
    MongooseModule.forFeature([
      { name: UserConfig.name, schema: UserConfigSchema },
    ]),
  ],
  exports: [UserConfigService],
})
export class UserConfigModule {}
