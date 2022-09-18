import { UserInterface } from '../../graphql/interfaces';

export interface CacheInterface {
  login?: {
    access_token: string;
    refresh_token: string;
    user: UserInterface;
  } | null;
}

export interface StoreContextInterface {
  cache: CacheInterface;
  changeCache: (newCache: Partial<CacheInterface>) => void;
}
