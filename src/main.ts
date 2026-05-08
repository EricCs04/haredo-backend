import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({
      limit: '10mb',
      extended: true,
    }));

  const config = new DocumentBuilder()
    .setTitle('API Haredo')
    .setDescription('Documentação da API')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token', 
    ) 
    .build();

    const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        
      forbidNonWhitelisted: true,
      transform: true,        
    }),
  );
 
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });
 
  await app.listen(process.env.PORT ?? 3001);
  console.log(`API rodando em: http://localhost:${process.env.PORT ?? 3001}`);
}
 
bootstrap();
