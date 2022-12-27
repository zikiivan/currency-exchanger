import { Component,OnInit } from '@angular/core';
import { CurrencyService } from './currency.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'currency_exchange';
  supportedCurrencies:any;
  conversion: any;
  historicalDays:string[]=[];
  constructor(
    private currencyService:CurrencyService
  ){}
 getHistoricalData(supported:any[]){
  this.historicalDays=this.currencyService.getPreviousDays();
  if(supported){
    let supported_currencies=''
    supported.forEach((data)=>{
      supported_currencies=supported_currencies+','+data.currency
   
  });
    this.currencyService.getHistoricalData(this.historicalDays).subscribe(data=>{
      this.currencyService.setGraphSubject(data);
    })
  }
  
  // 
}

ngOnInit(): void {
    this.currencyService.getSupportedSubject().subscribe((data:any)=>{
      if(data!=0){
        this.supportedCurrencies=data;
        // this.getHistoricalData(this.supportedCurrencies);
      }else{
        this.currencyService.supported().subscribe((supported:any)=>{
          this.supportedCurrencies=supported;
          this.currencyService.setSupportedSubject(supported);
          this.getHistoricalData(supported);
        })
      }
    })

    this.currencyService.getConversionSubject().subscribe((data:any)=>{
      if(data!=0){
        this.conversion=data;
      }else{
        this.currencyService.getConversion().subscribe((conversion)=>{
          this.currencyService.setConversionSubject(conversion);
        })
      }
    })

    
}
}
