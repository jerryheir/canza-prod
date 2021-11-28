import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/.env' });
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

const PORT = process.env.port || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    // origin: 'http://localhost:8080',
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(PORT);
}
bootstrap();
