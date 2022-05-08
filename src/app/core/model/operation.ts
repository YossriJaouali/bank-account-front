import {OperationType} from './operation-type';

export interface Operation {
  operationType: OperationType;
  amount: number;
  creationDate: string;
  accountNumber: number;
  description: string;
}

