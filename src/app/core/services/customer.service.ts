import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Customer} from '../model/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) {
  }

  getCustomer(customerIdentifier: number): Observable<Customer> {
    return this.http.get<Customer>(`/api/customer/${customerIdentifier}`);
  }
}
