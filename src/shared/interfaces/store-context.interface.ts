// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CacheInterface {}

export interface StoreContextInterface {
  cache: CacheInterface;
  changeCache: (newCache: Partial<CacheInterface>) => void;
}
