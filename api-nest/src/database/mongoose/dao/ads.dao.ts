import { Ad } from '../schemas/ads.schema';
import { Model } from 'mongoose';
import { AdsAbstractDao } from '../abstract/ads.abstract';

export class AdsDAO implements AdsAbstractDao{
  constructor(private adModel: Model<Ad>) {}

  async getAds() {
    const ads = await this.adModel.find();
    return ads;
  }

  async addAds(ad: Ad){
    const newAd = new this.adModel(ad);
    return newAd.save();
  }

  async deleteAd(adId:string){
    const ad = await this.adModel.findByIdAndDelete(adId);
    return ad;
  }
}
