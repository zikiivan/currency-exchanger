import { Component,OnInit } from '@angular/core';
import { debounce, debounceTime, distinctUntilChanged, Observable, of, shareReplay, Subject, switchMap } from 'rxjs';
import { CurrencyService } from '../currency.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  amount?:number;
  to:string='USD';
  from:string='EUR';
  supportedCurrencies:any[]=[];
  
  countries$=new Observable<any>;
  rates$=new Observable<any>;
  countries:any=[];

  topCurrencies:any=['USD','EUR','JPY','GBP','AUD','CAD','CHF','CNY','HKD'];
  fromRates:any=[];
  toAmount?:any;
  fromAmount: any;
  toCurrenciesRates?:any[]=[];
  $amount = new Subject<number>();
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

    this.currencyService.getConversionSubject().subscribe((data:any)=>{
      if(data!=0){
        this.currencyService.getFromRate(data.rates,this.from).then((dd)=>{
          this.fromRates= dd;
          this.toAmount=this.fromRates.find((datas:any)=>datas.currency==this.to)?.amount;
          this.fromAmount=this.fromRates.find((datas:any)=>datas.currency==this.from)?.amount;
          this.toCurrenciesRates=this.fromRates.filter((x:any) => this.topCurrencies.includes(x.currency));
      // console.log(this.toCurrenciesRates);
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

      this.currencyService.getConversionSubject().subscribe((data:any)=>{
        if(data!=0){
          this.currencyService.getFromRate(data,this.from).then((dd)=>{
            this.fromRates= dd;
            if(this.fromRates){
              this.toAmount=this.fromRates.find((datas:any)=>datas.currency==this.to)?.amount;
              this.fromAmount=this.fromRates.find((datas:any)=>datas.currency==this.from)?.amount;
              this.toCurrenciesRates=this.fromRates.filter((x:any) => this.topCurrencies.includes(x.currency));
            }
          });
        
        }
      })
 }
}
