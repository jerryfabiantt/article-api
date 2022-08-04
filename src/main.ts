import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as morgan from 'morgan';
import * as compression from 'compression';
import { json, urlencoded } from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());

  // compress
  app.use(compression());

  // logs req. to console
  app.use(morgan('dev'));

  // parse json data
  app.use(json({ limit: '5mb' }));
  // parse application/x-www-form-urlencoded
  app.use(urlencoded({ limit: '5mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      validationError: { target: false, value: true },
      validateCustomDecorators: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('Articles Backend API')
    .setDescription('The articles API description')
    .setVersion('1.0')
    .addTag('articles')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
