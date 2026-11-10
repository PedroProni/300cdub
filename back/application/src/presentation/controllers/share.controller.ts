import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from '@infrastructure/security/public.decorator';
import { SharePageService } from '@application/services/share-page.service';
import { SHARE_CACHE_CONTROL, SHARE_ROUTE_PREFIX } from '@domain/constants/share.constant';

@Public()
@Controller(SHARE_ROUTE_PREFIX)
export class ShareController {
  constructor(private readonly share: SharePageService) {}

  @Get(':slug')
  @Header('Cache-Control', SHARE_CACHE_CONTROL)
  async page(@Param('slug') slug: string, @Res() res: Response): Promise<void> {
    const html = await this.share.render(slug);
    if (!html) {
      res.redirect(302, this.share.siteUrl());
      return;
    }
    res.type('html').send(html);
  }
}
