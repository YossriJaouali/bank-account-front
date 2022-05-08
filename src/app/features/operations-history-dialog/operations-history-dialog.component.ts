import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {switchMap, takeUntil} from 'rxjs/operators';
import {OperationService} from '../../core/services/operation.service';
import {Operation} from '../../core/model/operation';
import {Page} from '../../core/model/page';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-operations-history-dialog',
  templateUrl: './operations-history-dialog.component.html',
  styleUrls: ['./operations-history-dialog.component.css']
})
export class OperationsHistoryDialogComponent implements OnInit, AfterViewInit, OnDestroy {

  displayedColumns = ['type', 'amount', 'creationDate', 'description'];
  dataSource = new MatTableDataSource<Operation>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$!: Subject<boolean>;

  constructor(private operationService: OperationService,
              public dialogRef: MatDialogRef<OperationsHistoryDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {accountNumber: number}) {
  }

  ngOnInit(): void {
    this.destroy$ = new Subject<boolean>();
    this.operationService.getAllOperations(this.data.accountNumber, 0, 5)
      .pipe(takeUntil(this.destroy$))
      .subscribe((page: Page<Operation>) => {
        this.dataSource.data = page.content;
        if (!!this.paginator) {
          this.paginator.length = page.total;
          this.paginator.pageSize = page.pageSize;
          this.paginator.pageIndex = page.page;
        }
      });
  }

  ngAfterViewInit(): void {
    this.paginator?.page
      .pipe(switchMap((pageEvent) =>
        this.operationService.getAllOperations(this.data.accountNumber, pageEvent.pageIndex, pageEvent.pageSize)))
      .pipe(takeUntil(this.destroy$))
      .subscribe((page: Page<Operation>) => {
        this.dataSource.data = page.content;
        this.paginator.length = page.total;
        this.paginator.pageSize = page.pageSize;
        this.paginator.pageIndex = page.page;
      });
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
