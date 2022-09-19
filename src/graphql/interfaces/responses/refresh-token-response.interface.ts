import { UserInterface } from '../user.interface';

export interface RefreshTokenResponseInterface {
  refreshTokenV2: {
    access_token: string;
    refresh_token: string;
    user: UserInterface;
  };
}
