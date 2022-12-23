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
  
  countries$=new Observable<any>;
  countries:any=[];

  constructor(private currencyService:CurrencyService ){
    
   }
   array_items=[...Array(9).keys()]

   swap(){
    let current_to=this.to;
    let current_from =this.from;
    this.to=current_from;
    this.from=current_to;
   }

   convert(){
    this.countries$.subscribe(data=>this.countries=data.slice(0,9))
  }
   

  ngOnInit(): void {
    
  
  this.countries$= this.currencyService.getCurrency().pipe(
        shareReplay()
      );
 }
}
