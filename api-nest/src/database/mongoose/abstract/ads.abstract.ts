export abstract class AdsAbstractDao{
    abstract getAds(): Promise<any>;
    abstract addAds(ad: any): Promise<any>;
    abstract deleteAd(adId: string): Promise<any>;
}