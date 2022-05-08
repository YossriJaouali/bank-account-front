import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Operation} from '../model/operation';
import {Page} from '../model/page';

@Injectable({
  providedIn: 'root'
})
export class OperationService {

  constructor(private http: HttpClient) {
  }

  getAllOperations(accountNumber: number, pageIndex: number, pageSize: number): Observable<Page<Operation>> {
    return this.http.get<Page<Operation>>(`/api/bank-account/${accountNumber}/operations?pageIndex=${pageIndex}&pageSize=${pageSize}`);
  }
}
