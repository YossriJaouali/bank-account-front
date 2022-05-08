import {TestBed} from '@angular/core/testing';

import {OperationService} from './operation.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Page} from '../model/page';
import {Operation} from '../model/operation';
import {OperationType} from '../model/operation-type';

describe('OperationService', () => {
  const accountNumber = 123456789;
  const operations: Page<Operation> = {
    page: 0,
    total: 2,
    numberOfPages: 1,
    pageSize: 10,
    content: [{
      operationType: OperationType.WITHDRAW,
      amount: 2000.00,
      creationDate: new Date().toDateString(),
      accountNumber: 123456789,
      description: 'Withdraw 2000 EUR'
    }, {
      operationType: OperationType.DEPOSIT,
      amount: 1000.00,
      creationDate: new Date().toDateString(),
      accountNumber: 123456789,
      description: 'Deposit 1000 EUR'
    }]
  };

  let operationService: OperationService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    operationService = TestBed.inject(OperationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(operationService).toBeTruthy();
  });

  it('should retrieve the operations history for a bank account', () => {
    const pageIndex = 0;
    const pageSize = 1;

    operationService.getAllOperations(accountNumber, pageIndex, pageSize).subscribe((operationsPage: Page<Operation>) => {
      expect(operationsPage).not.toBeNull();
      expect(operationsPage.pageSize).toEqual(10);
      expect(operationsPage.page).toEqual(0);
      expect(operationsPage.numberOfPages).toEqual(1);
      expect(operationsPage.total).toEqual(2);
      expect(operationsPage.content.length).toEqual(2);
    });

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: `/api/bank-account/${accountNumber}/operations?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    });

    req.flush(operations);
  });
});
