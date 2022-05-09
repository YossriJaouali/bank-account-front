import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OperationDialogComponent} from './operation-dialog.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, FormGroup} from '@angular/forms';
import {OperationType} from '../../core/model/operation-type';
import {throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

describe('OperationDialogComponent', () => {
  let component: OperationDialogComponent;
  let fixture: ComponentFixture<OperationDialogComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OperationDialogComponent],
      providers: [{ provide: MatDialogRef, useValue: mockDialogRef},
        { provide: MAT_DIALOG_DATA, useValue: { data: {operationType: 'Withdraw'}}}
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.operationForm = new FormGroup({
      amount: new FormControl(345.98),
      description: new FormControl('Deposit 345.98 EUR')
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal and pass the amount and the description data after save of the operation', () => {
    component.save();
    expect(mockDialogRef.close).toHaveBeenCalledWith(component.operationForm.value);
  });

  it('should close the operation modal', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

});
