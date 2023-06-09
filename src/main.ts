import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // @ts-ignore
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({
    enableDebugMessages: true,
  }));
  await app.listen(process.env.PORT || 3000);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
