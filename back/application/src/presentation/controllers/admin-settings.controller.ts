import { Body, Controller, Get, Put } from '@nestjs/common';
import { SettingsService } from '@application/services/settings.service';
import { SettingsDto } from '@presentation/dtos/settings.dto';

@Controller('admin/settings')
export class AdminSettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  get() {
    return this.settings.get();
  }

  @Put()
  save(@Body() dto: SettingsDto) {
    return this.settings.save({ instagramHandle: dto.instagramHandle, whatsappNumber: dto.whatsappNumber, messageTemplate: dto.messageTemplate });
  }
}
