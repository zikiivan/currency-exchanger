import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, shareReplay } from 'rxjs';
import { SUPPORTED } from './supported';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
 
  $countries=new Observable;
  API_KEY="eba29bf5143cb8d3976f504df29a9b96";
  $supported=new BehaviorSubject(0);
  constructor(private http:HttpClient) { }

  //supported currencies stored
  setSupportedSubject(data:any){
   this.$supported.next(data); 
  }
  // return supported subject
  getSupportedSubject(){
    return this.$supported.asObservable();
  }

  
  //get suported currencies
   supported(){
    
    return of(SUPPORTED).pipe(
      map((data)=>{
        let rr=[];
        for(let c in data.symbols){
          let cc:any={}
          cc.currency=c;
          cc.description=data.symbols[c];
          rr.push(cc);
       }
       return rr
      })
    );
    return this.http.get<any>(`http://data.fixer.io/api/symbols`);
  }

  getConversion(from:string,to:string,supportedCurencies:any[]){
    let supportedc:any=supportedCurencies;
    if(!supportedCurencies.includes(to)){
      supportedCurencies.push(to);
    }

    if(!supportedCurencies.includes(from)){
      supportedCurencies.push(from);
    }

      supportedc=[...new Set(supportedCurencies)];

    let symbols =supportedc.reduce((currencies:any,next:any)=>currencies+','+next);
    let queryParams = new HttpParams();
    queryParams = queryParams.append("base",'EUR');
    queryParams = queryParams.append("symbols",symbols);

    return of({
      "success": true,
      "timestamp": 1671867483,
      "base": "EUR",
      "date": "2022-12-24",
      "rates": {
          "USD": 1.066776,
          "EUR": 1,
          "JPY": 141.630529,
          "GBP": 0.885071,
          "AUD": 1.587474,
          // "CAD": 1.455563,
          // "CHF": 0.995616,
          // "HKD": 8.327519,
          // "TMT": 3.744383,
          // "CRC": 620.732578
      }
  }).pipe(
    map((data)=>{
     let  formated= this.formatRates(data.rates)
     console.log(formated)
    return formated
    })
  )
    return this.http.get<any>(
      `http://data.fixer.io/api/latest`,{params:queryParams});
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

  // utility classes
  formatRates(rates:any){
    console.log(rates)
    let rate_collection=[];
  for(let rate in rates){

     rate_collection.push({
      'currency':rate,
      'amount':rates[rate],
     });

  }
  console.log(rates,rate_collection);
  return rate_collection
  }

  getFromRate(data:any, from:any){
       let from_rates:any=[];
      let current_from_value= data.find((data2:any)=>data2.currency==from).amount;
      console.log(current_from_value);
      // from_rates=data.map((datas:any)=>{
      //   // console.log(datas)
      //   return datas
      // })
      data.forEach((datas:any)=>{
         console.log(datas.currency,((datas.amount)/current_from_value))
        //  data.amount=((datas.amount)/current_from_value);
      })

      console.log(data);

      return from_rates
  }

}
