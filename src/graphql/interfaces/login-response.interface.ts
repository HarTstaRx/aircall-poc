import { UserInterface } from './user.interface';

export interface LoginResponseInterface {
  login: {
    access_token: string;
    refresh_token: string;
    user: UserInterface;
  };
}
