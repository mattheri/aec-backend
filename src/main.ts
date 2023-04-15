import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = new DocumentBuilder()
    .setTitle('Api Simulation de stage')
    .setDescription('API AEC 2023')
    .setVersion('1.0')
    .addTag('stage')
    .addBearerAuth(undefined, 'defaultBearerAuth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // @ts-ignore
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({
    enableDebugMessages: true,
  }));
  await app.listen(3000);
}
bootstrap();
