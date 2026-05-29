export abstract class AdsAbstractService{
    abstract getAds(): Promise<any>;
    abstract addAds(ad: any): Promise<any>;
    abstract deleteAd(adId: string): Promise<any>;

}