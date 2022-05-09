import {Component, OnDestroy, OnInit} from '@angular/core';
import {Customer} from '../../core/model/customer';
import {Subject, throwError} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {OperationDialogComponent} from '../operation-dialog/operation-dialog.component';
import {OperationsHistoryDialogComponent} from '../operations-history-dialog/operations-history-dialog.component';
import {CustomerService} from '../../core/services/customer.service';
import {AccountService} from '../../core/services/account.service';
import {catchError, filter, takeUntil} from 'rxjs/operators';
import {OperationCommand} from '../../core/model/operation-command';
import {Account} from '../../core/model/account';
import {AlertDialogComponent} from '../../shared/alert-dialog/alert-dialog.component';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
    selector: 'app-bank-account',
    templateUrl: './bank-account.component.html',
    styleUrls: ['./bank-account.component.css'],
})
export class BankAccountComponent implements OnInit, OnDestroy {

    customerIdentifier = 123456789;
    customer!: Customer;
    numberOfAccounts = 0;

    private destroy$!: Subject<boolean>;

    constructor(private customerService: CustomerService,
                private accountService: AccountService,
                public dialog: MatDialog) {
    }

    ngOnInit(): void {
        this.destroy$ = new Subject<boolean>();
        this.customerService.getCustomer(this.customerIdentifier)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (user: Customer) => {
                    this.customer = user;
                    this.numberOfAccounts = user.accounts.length;
                });
    }

    openWithdrawDialog(accountNumber: number): void {
        const dialogConfig: MatDialogConfig = {
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
        };
        const dialogRef = this.dialog.open(OperationDialogComponent, dialogConfig);
        dialogRef.afterClosed()
            .pipe(takeUntil(this.destroy$), filter((operationCommand: OperationCommand) => !!operationCommand))
            .subscribe((operationCommand: OperationCommand) => this.withdrawMoney(accountNumber, operationCommand)
            );
    }

    openDepositDialog(accountNumber: number): void {
        const dialogConfig: MatDialogConfig = {
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
        };
        const dialogRef = this.dialog.open(OperationDialogComponent, dialogConfig);
        dialogRef.afterClosed()
            .pipe(takeUntil(this.destroy$), filter((operationCommand: OperationCommand) => !!operationCommand))
            .subscribe((operationCommand: OperationCommand) => this.depositMoney(accountNumber, operationCommand));
    }

    openOperationsHistoryDialog(selectedAccountNumber: number): void {
        const dialogConfig: MatDialogConfig = {
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
        };
        this.dialog.open(OperationsHistoryDialogComponent, dialogConfig);
    }

    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }

    private withdrawMoney(accountNumber: number, operationCommand: OperationCommand): void {
        this.accountService.withdraw(accountNumber, operationCommand)
            .pipe(takeUntil(this.destroy$),
                catchError((httpErrorResponse: HttpErrorResponse) => {
                    this.displayErrorMessage(httpErrorResponse);
                    return throwError(httpErrorResponse);
                }))
            .subscribe((account: Account) => {
                this.customer.accounts.filter(acc => acc.accountNumber === accountNumber)
                    .map(acc => acc.balance = account.balance);
            });
    }

    private depositMoney(accountNumber: number, operationCommand: OperationCommand): void {
        this.accountService.deposit(accountNumber, operationCommand)
            .pipe(takeUntil(this.destroy$),
                catchError((err: HttpErrorResponse) => {
                    this.displayErrorMessage(err);
                    return throwError(err);
                }))
            .subscribe((account: Account) => {
                this.customer.accounts.filter(acc => acc.accountNumber === accountNumber)
                    .map(acc => acc.balance = account.balance);
            });
    }

    private displayErrorMessage(httpErrorResponse: HttpErrorResponse): void{
        this.dialog.open(AlertDialogComponent, {
            disableClose: true,
            hasBackdrop: true,
            backdropClass: '',
            width: '500px',
            position: {
                top: '50vh',
                left: '50vw'
            },
            data: {
                message: httpErrorResponse.error.message
            },
            panelClass: 'middle'
        });
    }
}
