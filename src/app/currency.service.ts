import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, shareReplay } from 'rxjs';
import { LATEST, SUPPORTED } from './supported';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
 
  $countries=new Observable;
  API_KEY="eba29bf5143cb8d3976f504df29a9b96";
  $supported=new BehaviorSubject(0);
  $conversion=new BehaviorSubject(0);
  $amount=new BehaviorSubject(0);
  constructor(private http:HttpClient) { }

  //supported currencies stored
  setSupportedSubject(data:any){
   this.$supported.next(data); 
  }
  // return supported subject
  getSupportedSubject(){
    return this.$supported.asObservable();
  }

  //supported currencies stored
  setConversionSubject(data:any){
   this.$conversion.next(data); 
  }
  
  // return supported subject
  getConversionSubject(){
    return this.$conversion.asObservable();
  }
  //supported currencies stored
  setAmountSubject(data:any){
   this.$amount.next(data); 
  }
  
  // return supported subject
  getAmountSubject(){
    return this.$amount.asObservable();
  }

  
  //get suported currencies
   supported(){
    
    return of(SUPPORTED)
    .pipe(
      map((data)=>{
        let symbols=[];
        for(let sy in data.symbols){
          let symbol:any={}
          symbol.currency=sy;
          symbol.description=data.symbols[sy];
          symbols.push(symbol);
       }
       return symbols
      })
    );
    return this.http.get<any>(`http://data.fixer.io/api/symbols`);
  }

  getConversion(from?:string,to?:string,supportedCurencies?:any[]){
    return of(LATEST)
    .pipe(
    map((data)=>{
     let  formated= this.formatRates(data.rates)
     data.rates=formated;
    return data
    })
  )
    return this.http.get<any>(
      `http://data.fixer.io/api/latest`).pipe(
        map((data)=>{
         let  formated= this.formatRates(data.rates)
         console.log(formated)
        return formated
        })
      );
  }
 
   getCurrency(){
    return this.http.get<any>('https://restcountries.com/v3.1/all');
  }

  getHistoricalData(start_date:string, end_date:string, symbols:string){
      let searchParams=new HttpParams();
      // searchParams=searchParams.append("start_date",start_date)
      // searchParams=searchParams.append("end_date",end_date)
      searchParams=searchParams.append("symbols",symbols)
    return this.http.get<any>(`http://data.fixer.io/api/${start_date}`,{
      params:searchParams
    });
  }
  // }

  // utility classes
  formatRates(rates:any){
    let rate_collection=[];
  for(let rate in rates){

     rate_collection.push({
      'currency':rate,
      'amount':rates[rate],
     });

  }
  return rate_collection
  }

  getFromRate(data:any, from:any){
    console.log(from)
    console.log(data)
       let from_rates:any=[];
      let current_from_value= data.find((data2:any)=>data2.currency==from).amount;
      data.forEach((datas:any)=>{
         let amount=((datas.amount)/current_from_value);
         from_rates.push({
          amount:amount,
          currency:datas.currency
         })
         
      })
      return from_rates
  }

}
