import { UserInterface } from '../../graphql/interfaces';
import { SnackbarInterface } from './snackbar.interface';

export interface CacheInterface {
  login?: {
    access_token: string;
    refresh_token: string;
    user: UserInterface;
  } | null;
}

export interface StoreContextInterface {
  cache: CacheInterface;
  snackbar?: SnackbarInterface;
  changeCache: (newCache: Partial<CacheInterface>) => void;
  changeSnackbar: (snackbar: SnackbarInterface) => void;
}
