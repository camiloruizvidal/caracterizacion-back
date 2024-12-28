import { NestFactory } from '@nestjs/core';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Constantes } from './utils/constantes';
import { obtenerNivelesLog } from './utils/logger.enum';
import { Config } from './config/Config';
import * as moment from 'moment';
import 'moment-timezone';
import { formatearErroresValidacion } from './utils/formatear-errores-validacion';
import * as express from 'express';

async function bootstrap() {
  moment.tz.setDefault('UTC');
  moment.locale('es');
  const puerto = Config.puerto;

  const app = await NestFactory.create(AppModule, {
    logger: obtenerNivelesLog(
      Config.ambiente.toLowerCase() === Constantes.PRODUCCION
    )
  });

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      //enableImplicitConversion: true,
      exceptionFactory: errors => {
        const mensajeValidaciones = formatearErroresValidacion(errors);
        return new BadRequestException(mensajeValidaciones);
      }
    })
  );

  const config = new DocumentBuilder()
    .setTitle('SICP-API')
    .setDescription('API del sistema de informacion')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('documentacion', app, document);

  await app.listen(puerto);
  Logger.log(`SICP-api corriendo satisfactoriamente en el puerto ${puerto}`);
}
bootstrap();
