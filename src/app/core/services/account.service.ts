import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Account} from '../model/account';
import {OperationCommand} from '../model/operation-command';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) {
  }

  deposit(accountNumber: number, operationCommand: OperationCommand): Observable<Account> {
    return this.http.put<Account>(`/api/bank-account/${accountNumber}/deposit`, operationCommand);
  }

  withdraw(accountNumber: number, operationCommand: OperationCommand): Observable<Account> {
    return this.http.put<Account>(`/api/bank-account/${accountNumber}/withdraw`, operationCommand);
  }

}
