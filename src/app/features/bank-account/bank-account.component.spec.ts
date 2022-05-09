import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BankAccountComponent} from './bank-account.component';
import {CustomerService} from '../../core/services/customer.service';
import {AccountService} from '../../core/services/account.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Observable, of, throwError} from 'rxjs';
import {Customer} from '../../core/model/customer';
import {Account} from '../../core/model/account';
import {OperationDialogComponent} from '../operation-dialog/operation-dialog.component';
import {OperationsHistoryDialogComponent} from '../operations-history-dialog/operations-history-dialog.component';

describe('BankAccountComponent', () => {
  const selectedAccountNumber = 123456789;
  const customer: Customer = {
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
  const account: Account = {
    balance: 1230.76,
    accountNumber: 123456789,
    currency: 'EUR',
  };
  let component: BankAccountComponent;
  let fixture: ComponentFixture<BankAccountComponent>;

  let spyCustomerService: CustomerService;
  let spyAccountService: AccountService;
  let spyMatDialog: MatDialog;

  beforeEach(async () => {
    spyCustomerService = jasmine.createSpyObj('CustomerService', ['getCustomer']);
    spyCustomerService.getCustomer = jasmine.createSpy().and.returnValue(of(customer));
    spyAccountService = jasmine.createSpyObj('AccountService', ['deposit', 'withdraw']);
    spyAccountService.deposit = jasmine.createSpy().and.returnValue(of(account));
    spyAccountService.withdraw = jasmine.createSpy().and.returnValue(of(account));
    spyMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
    spyMatDialog.open = jasmine.createSpy().and.returnValue({
      afterClosed: () => of({
        amount: 23,
        description: 'description'
      })
    });
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BankAccountComponent],
      providers: [{provide: CustomerService, useValue: spyCustomerService},
        {provide: AccountService, useValue: spyAccountService},
        {provide: MatDialog, useValue: spyMatDialog}
        ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the withdraw dialog', () => {
    component.openWithdrawDialog(selectedAccountNumber);

    expect(spyMatDialog.open).toHaveBeenCalledWith(OperationDialogComponent, {
        disableClose: true,
        hasBackdrop: true,
        backdropClass: '',
        width: '250px',
        position: {
          top: '50vh',
          left: '50vw'
        },
        data: {
          operationType: 'Withdraw money'
        },
        panelClass: 'middle'
      });
  });

  it('should open the deposit dialog', () => {
    component.openDepositDialog(selectedAccountNumber);

    expect(spyMatDialog.open).toHaveBeenCalledWith( OperationDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      width: '250px',
      position: {
        top: '50vh',
        left: '50vw'
      },
      data: {
        operationType: 'Deposit money'
      },
      panelClass: 'middle'
    });
  });

  it('should open the deposit dialog', () => {
    component.openOperationsHistoryDialog(selectedAccountNumber);

    expect(spyMatDialog.open).toHaveBeenCalledWith( OperationsHistoryDialogComponent, {
      disableClose: true,
      hasBackdrop: true,
      backdropClass: '',
      width: '500px',
      position: {
        top: '50vh',
        left: '50vw'
      },
      data: {
        accountNumber: selectedAccountNumber
      },
      panelClass: 'middle'
    });
  });

});
