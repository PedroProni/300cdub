import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';
import { EnvConfigService } from '@common/env/env-config.service';
import { setupSwagger } from '@infrastructure/documentation/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  const env = app.get(EnvConfigService);
  if (env.isSwaggerEnabled()) setupSwagger(app);
  await app.listen(env.getPort());
}
bootstrap();
