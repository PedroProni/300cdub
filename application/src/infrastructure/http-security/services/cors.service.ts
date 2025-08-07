import { Injectable, Logger } from '@nestjs/common';
import { EnvConfigService } from '@common/env/services/env-config.service';

@Injectable()
export class CorsService {
  private readonly logger = new Logger(CorsService.name);

  constructor(private readonly envService: EnvConfigService) {}

  async setCors(app: any) {
    const label = this.envService.getLabel();
    const label_origins: string[] = [];

    switch (label) {
      case 'Cassino':
        label_origins.push('https://cassino-bet-br-homolog.cactusgaming.net/', 'https://cassino-bet-br-homolog-2.cactusgaming.net/', 'https://cassino-bet-br-homolog-3.cactusgaming.net/', 'https://cassino-bet-br-homolog-4.cactusgaming.net/');
        break;
      case '7k':
        label_origins.push('https://7k-bet-br-homolog.cactusgaming.net/', 'https://7k-bet-br-homolog-2.cactusgaming.net/', 'https://7k-bet-br-homolog-3.cactusgaming.net/', 'https://7k-bet-br-homolog-4.cactusgaming.net/');
        break;
      case 'Vera':
        label_origins.push('https://vera-bet-br-homolog.cactusgaming.net/', 'https://vera-bet-br-homolog-2.cactusgaming.net/', 'https://vera-bet-br-homolog-3.cactusgaming.net/', 'https://vera-bet-br-homolog-4.cactusgaming.net/');
        break;
      default:
        this.logger.warn(`No specific CORS origins configured for label: ${label}`);
        break;
    }

    const allowed_origins = [this.envService.getProdDomain().trim().replace(/\/$/, ''), this.envService.getLocalDomain().trim().replace(/\/$/, ''), ...label_origins];

    app.enableCors({
      origin: (origin: string, callback: (err: Error | null, allow?: boolean) => void) => {
        const sanitized_origin = origin?.trim().replace(/\/$/, '');

        if (!origin || allowed_origins.includes(sanitized_origin)) {
          callback(null, true);
        } else {
          this.logger.warn(`Blocked CORS origin: ${origin}`);
          callback(new Error('Not allowed by CORS'), false);
        }
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'x-api-key'],
      credentials: true,
    });

    this.logger.log('CORS has been configured');
  }
}
