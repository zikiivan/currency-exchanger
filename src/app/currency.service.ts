import { DatePipe } from '@angular/common';
import { HttpClient , HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, map, mergeMap, Observable, of, shareReplay, toArray } from 'rxjs';
import { HistoricalData, HISTORICALDATA, LATEST, Rates, SUPPORTED } from './supported';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
 
  $countries=new Observable;
  API_KEY="eba29bf5143cb8d3976f504df29a9b96";
  URL="https://api.apilayer.com/fixer";
  URL2="https://api.apilayer.com/fixer/";
  $supported=new BehaviorSubject(0);
  $conversion=new BehaviorSubject<HistoricalData|any>(0);
  $amount=new BehaviorSubject(0);
  $graph=new BehaviorSubject(0);
  constructor(private http:HttpClient,
    private datePipe:DatePipe) { }

  //supported currencies stored
  setSupportedSubject(data:any){
   this.$supported.next(data); 
  }
  // return supported subject
  getSupportedSubject(){
    return this.$supported.asObservable();
  }

  //all conversions stored
  setConversionSubject(data:any){
   this.$conversion.next(data); 
  }
  
  // return all conversions
  getConversionSubject():(HistoricalData| any){
    return this.$conversion.asObservable();
  }
  //amount stored
  setAmountSubject(data:any){
   this.$amount.next(data); 
  }
  
  // amount retrieved
  getAmountSubject(){
    return this.$amount.asObservable();
  }
  //graph data stored
  setGraphSubject(data:any){
   this.$graph.next(data); 
  }
  
  // return graph data
  getGraphSubject(){
    return this.$graph.asObservable();
  }

  
  //get suported currencies
   supported(){
    return this.http.get<any>(`${this.URL}/symbols`).pipe(
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
  }

  getConversion(){
    return this.http.get<any>(
      `${this.URL}/latest`).pipe(
        map((data)=>{
         let  formated= this.formatRates(data.rates)
        return formated
        })
      );
  }

  getHistoricalData(dates:string[]){
      
      return from(dates).pipe(
        mergeMap((history:any)=>from(this.getHistory(history)),4),
        toArray());
   
  }
  getHistory(date:string){
     return this.http.get<any>(`${this.URL}/${date}`).pipe(map((data)=>{
      let formated= this.formatRates(data.rates)
      return {
        date:data.date,
        rates:formated
      }
    }));
  }

  getConvertedHistoricalData(){

    this.getGraphSubject().subscribe((data:any)=>{
      
      if(data!=0){
        console.log(data[0])
        return of(data);
      }else{
        return of([]);
      }
      
    })
}

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

  async getFromRate(data:Rates[], from:string){

    let from_rates:Rates[]=[];
    if(data){
      let current_from_value=  data.find((data2:any)=>data2.currency==from)?.amount;
      data.forEach((datas:Rates)=>{
         let amount:number=((datas.amount)/current_from_value!);
         from_rates.push({
          amount:amount,
          currency:datas.currency
         })
         
      })
    }
       
      return await from_rates
  }

  getPreviousDays(){
    let x=1
    let historicdays:any[]=[];
    while(x<=12){
      let end_date = new Date();
      if(end_date.getDate()>28){
        let freshdate=`${end_date.getFullYear()}-${end_date.getMonth()}-${end_date.getDate()-4}`;
        end_date=new Date(freshdate)
      }
    end_date.setMonth(end_date.getMonth() - x);
   let dd= this.datePipe.transform(end_date,'yyyy-MM-dd')
   historicdays.push(this.getLastDay(dd));
      ++x;
    }
    return historicdays
  }

  getLastDay(sdate:any){
    let date=new Date(sdate);
   var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth()+1, 0);
   let last_day=this.datePipe.transform(lastDayOfMonth,'yyyy-MM-dd')!;
   return last_day;
  }

}
