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
  constructor(
    private currencyService:CurrencyService
  ){}

ngOnInit(): void {
    this.currencyService.getSupportedSubject().subscribe((data:any)=>{
      if(data!=0){
        this.supportedCurrencies=data;
      }else{
        this.currencyService.supported().subscribe((supported:any)=>{
          this.supportedCurrencies=supported;
          this.currencyService.setSupportedSubject(supported);
        })
      }
    })

    // console.log(this.supportedCurrencies);
}
}
