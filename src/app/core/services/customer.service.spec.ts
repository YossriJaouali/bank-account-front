import {TestBed} from '@angular/core/testing';

import {CustomerService} from './customer.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {Customer} from '../model/customer';

describe('CustomerService', () => {
  const customerIdentifier = 12345679;
  const mockedCustomer: Customer = {
    identifier: '1234',
    firstName: 'Yossri',
    lastName: 'JAOUALI',
    accounts: [{
      balance: 12200.09,
      accountNumber: 98,
      currency: 'EUR',
    }, {
      balance: 12200.89,
      accountNumber: 99,
      currency: 'USD',
    }, {
      balance: 320.00,
      accountNumber: 100,
      currency: 'EUR'
    }]
  };

  let customerService: CustomerService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    customerService = TestBed.inject(CustomerService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(customerService).toBeTruthy();
  });

  it('should retrieve the customer', () => {
    customerService.getCustomer(customerIdentifier).subscribe((customer: Customer) => {
      expect(customer).toEqual(mockedCustomer);
    });

    const req = httpTestingController.expectOne({
      method: 'GET',
      url: `/api/customer/${customerIdentifier}`,
    });

    req.flush(mockedCustomer);
  });
});
