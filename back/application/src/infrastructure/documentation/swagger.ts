import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder().setTitle('300c.dub API').setDescription('Showroom catalog and backoffice API').setVersion('1.0').addCookieAuth('cdub_session').build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));
}
