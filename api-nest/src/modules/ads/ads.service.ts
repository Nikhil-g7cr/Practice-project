import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Ad } from '../../database/mongoose/schemas/ads.schema';
import { AdsAbstractService } from './ads.abstract';
import { AdsAbstractDao } from '../../database/mongoose/abstract/ads.abstract';

@Injectable()
export class AdsService implements AdsAbstractService {
  constructor(
    @InjectModel(Ad.name)
    private adsDao: AdsAbstractDao,
  ) {}

  async getAds() {
    const ads = await this.adsDao.getAds();
    return ads;
  }

  async addAds(ad: Ad) {
    const newAd = this.adsDao.addAds(ad);
    return newAd;
  }

  async deleteAd(adId: string) {
    const ad = await this.adsDao.deleteAd(adId);
    return ad;
  }
}
