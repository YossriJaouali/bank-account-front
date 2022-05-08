import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {OperationsHistoryDialogComponent} from './operations-history-dialog.component';
import {OperationService} from '../../core/services/operation.service';
import {of} from 'rxjs';
import {OperationType} from '../../core/model/operation-type';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {ChangeDetectorRef} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('OperationsHistoryDialogComponent', () => {
  const operations = [{
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
  }];

  let component: OperationsHistoryDialogComponent;
  let fixture: ComponentFixture<OperationsHistoryDialogComponent>;
  let spyOperationService: OperationService;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async () => {
    spyOperationService = jasmine.createSpyObj('OperationService', ['getAllOperations']);
    spyOperationService.getAllOperations = jasmine.createSpy().and.returnValue(of(operations));
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationsHistoryDialogComponent],
      providers: [{provide: OperationService, useValue: spyOperationService},
        {provide: MatDialogRef, useValue: mockDialogRef},
        {provide: MAT_DIALOG_DATA, useValue: { data: { accountNumber: 123456789}}}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationsHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the operations history modal', fakeAsync(() => {
    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null);
    tick();
    fixture.detectChanges();
    expect(mockDialogRef.close).toHaveBeenCalled();
  }));
});
