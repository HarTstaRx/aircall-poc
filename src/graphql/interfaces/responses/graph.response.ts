import { ErrorInterface } from '../error.interface';

export interface GraphResponseInterface<T> {
  data: T;
  errors: ErrorInterface[];
}
