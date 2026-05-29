import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Patch,
  Post,
} from '@nestjs/common';
import { AdsAbstractService } from './ads.abstract';
import { CreateAdDto } from './ads.dto';

@Controller('api/ads')
export class AdsController {
  constructor(private readonly adsService: AdsAbstractService) {}

  @Post()
  async createAd(@Body() Ads: CreateAdDto) {
    try {
      const ad = await this.adsService.addAds(Ads);
      return { status: 'Success', code: HttpStatus.CREATED, data: ad };
    } catch (error: any) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create laptop');
    }
  }

  @Get()
  async getAds() {
    try {
      const ads = await this.adsService.getAds();
      return { status: 'Success', code: HttpStatus.OK, data: ads };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch ads');
    }
  }

  @Patch(':id')
  async updateAd(@Body() Ads: CreateAdDto) {

    try {
      const ad = await this.adsService.addAds(Ads);
      return { status: 'Success', code: HttpStatus.OK, data: ad };
    } catch (error: any) {
      if (error instanceof ConflictException) {
        throw error;
      } 
      throw new InternalServerErrorException('Failed to update ad');
    }
  }

  @Patch(':id')
  async deleteAd(@Body() Ads: CreateAdDto) {
    try {
      const ad = await this.adsService.deleteAd 
      return { status: 'Success', code: HttpStatus.OK, data: ad };
    } 
    catch (error: any) {
      if (error instanceof ConflictException) {
        throw error;
      } 
      throw new InternalServerErrorException('Failed to delete ad');
    }
  }
}
