import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
 
  $countries=new Observable;
  API_KEY="eBs4eEODXk19eGcPqd4GFGQFOvJMC3cn";
  constructor(private http:HttpClient) { }
  
  //get suported currencies
   supported(){
    return this.http.get<any>(`https://data.fixer.io/api/symbols?access_key = ${this.API_KEY}`);
  }

  getConversion(to:string,from:string){
    return this.http.get<any>(`
    https://data.fixer.io/api/latest ? access_key = ${this.API_KEY} & base = USD
    & symbols = GBP,JPY,EUR`);
  }
 
   getCurrency(){
    return this.http.get<any>('https://restcountries.com/v3.1/all');
  }

    getgg(){
    this.$countries=this.getCurrency().pipe(
      shareReplay()
    );

    return this.$countries;

  }

}
