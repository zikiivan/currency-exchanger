import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
 
  constructor(private http:HttpClient) { }

  getCurrency(){
    this.http.get()
  }

}
