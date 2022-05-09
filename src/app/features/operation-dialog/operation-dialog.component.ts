import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-operation-dialog',
  templateUrl: './operation-dialog.component.html',
  styleUrls: ['./operation-dialog.component.css']
})
export class OperationDialogComponent implements OnInit {

  operationType = '';
  operationForm = new FormGroup({
    amount: new FormControl('', [Validators.required, Validators.min(1),
      Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')]),
    description: new FormControl('')
  });

  constructor(public dialogRef: MatDialogRef<OperationDialogComponent>,
              @Optional() @Inject(MAT_DIALOG_DATA) public data: {operationType: string}) {
  }

  ngOnInit(): void {
    this.operationType = this.data.operationType;
  }

  save(): void {
    this.dialogRef.close(this.operationForm.value);
  }

  close(): void {
    this.dialogRef.close();
  }

}
