import {TestBed} from '@angular/core/testing';

import {AccountService} from './account.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Account} from '../model/account';
import {OperationCommand} from '../model/operation-command';

describe('AccountService', () => {
  const accountNumber = 123456789;
  const account: Account = {
    balance: 1230.76,
    accountNumber: 123456789,
    currency: 'EUR',
  };
  const operationCommand: OperationCommand = {
    amount: 1000,
    description: 'Withdraw 1000 EUR',
  };

  let accountService: AccountService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    accountService = TestBed.inject(AccountService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });


  it('should be created', () => {
    expect(accountService).toBeTruthy();
  });

  it('should withdraw the bank account', () => {
    accountService.withdraw(accountNumber, operationCommand).subscribe((updatedAccount: Account) => {
      expect(updatedAccount).toEqual(account);
    });

    const req = httpTestingController.expectOne({
      method: 'PUT',
      url: `/api/bank-account/${accountNumber}/withdraw`,
    });

    req.flush(account);
  });

  it('should deposit the bank account', () => {
    accountService.deposit(accountNumber, operationCommand).subscribe((updatedAccount: Account) => {
      expect(updatedAccount).toEqual(account);
    });

    const req = httpTestingController.expectOne({
      method: 'PUT',
      url: `/api/bank-account/${accountNumber}/deposit`,
    });

    req.flush(account);
  });
});
