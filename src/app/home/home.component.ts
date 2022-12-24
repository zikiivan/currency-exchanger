import { Component,OnInit } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
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

  topCurrencies:any=['USD','EUR','JPY','GBP','AUD','CAD','CHF','CNH','HKD'];
  fromRates:any=[];
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



   convert(){
    this.currencyService.getConversion(this.from,this.to,this.topCurrencies).subscribe((data)=>{
      console.log(data);
      this.fromRates=this.currencyService.getFromRate(data,this.from)
      console.log(this.fromRates);
    })
  }
   

  ngOnInit(): void {
    
  
  this.countries$= this.currencyService.getCurrency().pipe(
        shareReplay()
      );

      this.currencyService.getSupportedSubject().subscribe((data:any)=>{
        if(data!=0){
          this.supportedCurrencies=data;
          // console.log(this.supportedCurrencies);
        }
      })
 }
}
