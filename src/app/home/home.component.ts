import { Component,OnInit } from '@angular/core';
import { debounce, debounceTime, distinctUntilChanged, Observable, of, shareReplay, Subject, switchMap } from 'rxjs';
import { CurrencyService } from '../currency.service';
import { HistoricalData, Rates, SupportedCurrencies } from '../supported';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  amount?:number;
  to:string='USD';
  from:string='EUR';
  supportedCurrencies:SupportedCurrencies[]=[];
  topCurrencies:any=['USD','EUR','JPY','GBP','AUD','CAD','CHF','CNY','HKD'];
  fromRates:Rates[]=[];
  toAmount?:number=0;
  fromAmount?: number=0;
  toCurrenciesRates?:Rates[]=[];
  $amount = new Subject<number>();
  conversion?:number;
  constructor(private currencyService:CurrencyService ){
    
   }

   swap(){
    let current_to=this.to;
    let current_from =this.from;
    this.to=current_from;
    this.from=current_to;

    if(this.fromRates.length>0){
       this.convert()
    }
   }

   onAmountChange(){
    this.$amount.next(this.amount!);
     this.$amount.pipe(
      debounceTime(100),
      distinctUntilChanged()
     ).subscribe((data)=>{
      this.currencyService.setAmountSubject(data);
     })
   }



   convert(){

    this.currencyService.getConversionSubject().subscribe((data:Rates[]|any)=>{
      if(data!=0){
        console.log(data)
        this.currencyService.getFromRate(data,this.from).then((dd)=>{
          this.fromRates= dd;
          console.log(dd)
          this.toAmount=this.fromRates.find((datas:Rates)=>datas.currency==this.to)?.amount;
          this.fromAmount=this.fromRates.find((datas:Rates)=>datas.currency==this.from)?.amount;
          this.toCurrenciesRates=this.fromRates.filter((x:Rates) => this.topCurrencies.includes(x.currency));
      console.log(this.toCurrenciesRates);
          this.conversion=this.amount!*this.toAmount!;
        });
      }
    })

  }
   

  ngOnInit(): void {
    
  
  // this.countries$= this.currencyService.getCurrency().pipe(
  //       shareReplay()
  //     );

      this.currencyService.getSupportedSubject().subscribe((data:any)=>{
        if(data!=0){
          this.supportedCurrencies=data;
        }
      })

      this.currencyService.getConversionSubject().subscribe((data:Rates[]|any)=>{
        if(data!=0){
          console.log(data)
          this.currencyService.getFromRate(data,this.from).then((dd:Rates[])=>{
            this.fromRates= dd;
            
            if(this.fromRates){
              console.log(this.fromRates)
              console.log(dd)
              console.log(this.to)

              this.toAmount=this.fromRates.find((datas:any)=>datas.currency==this.to)?.amount;
              console.log(this.toAmount);
              this.fromAmount=this.fromRates.find((datas:Rates)=>datas.currency==this.from)?.amount;
              this.toCurrenciesRates=this.fromRates.filter((x:Rates) => this.topCurrencies.includes(x.currency));
              console.log(this.toCurrenciesRates)
            }
          });
        
        }
      })
 }
}
