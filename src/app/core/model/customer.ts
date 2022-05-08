import {Account} from './account';

export interface Customer {
  identifier: string;
  firstName: string;
  lastName: string;
  accounts: Account[];
}
