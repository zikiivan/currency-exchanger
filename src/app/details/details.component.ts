import { DatePipe, Location } from '@angular/common';
import { Component ,OnInit,ViewChild,AfterViewInit} from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import { CurrencyService } from '../currency.service';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { default as Annotation } from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, AfterViewInit{

  amount?:number;
  to:string='USD';
  from:string='EUR';
  supportedCurrencies:any[]=[];
  
  countries$=new Observable<any>;
  rates$=new Observable<any>;
  countries:any=[];

  topCurrencies:any=['USD','EUR','JPY','GBP','AUD','CAD','CHF','CNY','HKD'];
  fromRates?:any=[];
  toAmount?:any;
  fromAmount: any;
  toCurrenciesRates?:any[]=[];
  $amount = new Subject<number>();

  start_date?:string;
  end_date?:string;
  graph_data?:any;
  from_data?:any;

  historicalData={
    "success": true,
    "timeseries": true,
    "start_date": "2012-05-01",
    "end_date": "2012-05-03",
    "base": "EUR",
    "rates": {
        "2012-05-01":{
          "USD": 1.322891,
          "AUD": 1.278047,
          "CAD": 1.302303
        },
        "2012-05-02": {
          "USD": 1.315066,
          "AUD": 1.274202,
          "CAD": 1.299083
        }
        ,
        "2012-02-29": {
          "USD": 1.314491,
          "AUD": 1.280135,
          "CAD": 1.296868
        }
        ,
        "2012-05-31": {
          "USD": 1.314491,
          "AUD": 1.280135,
          "CAD": 1.296868
        }
        ,
        "2012-04-30": {
          "USD": 1.314491,
          "AUD": 1.280135,
          "CAD": 1.296868
        }
        ,
        "2012-03-31": {
          "USD": 1.314491,
          "AUD": 1.280135,
          "CAD": 1.296868
        }
    }
};

  supportedData:any={
    "success": true,
    "symbols": {
      "USD": "United Arab Emirates Dirham",
      "AUD": "Afghan Afghani",
      "CAD": "Albanian Lek",
      "UGX": "Ugandan Shillings"
      }
  }

  formattedRates:any;

  supportedCurencies:string[]=[]
  historicalDays:string[]=[]
  
  constructor(
    private currencyService:CurrencyService, 
    private aroute:ActivatedRoute, 
    private location:Location,
    private datePipe:DatePipe
          ){
            Chart.register(Annotation)
          }

          public lineChartData?: ChartConfiguration['data'];
        
          public lineChartOptions?: ChartConfiguration['options'];
        
          public lineChartType: ChartType = 'line';
        
          @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

          getSupportedCurrency(){
            // this.supportedCurencies=this
            for(let c in this.supportedData.symbols){
               this.supportedCurencies.push(c);
            }
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
            this.$amount.next(this.amount! || 0);
            // this.$amount
             this.$amount.pipe(
              debounceTime(100),
              distinctUntilChanged()
             ).subscribe((data)=>{
              this.currencyService.setAmountSubject(data);
             })
           }
        
        
        
           convert(){
            this.currencyService.getConversionSubject().subscribe((data:any)=>{
              this.currencyService.getFromRate(data.rates,this.from).then((dd)=>{
                this.fromRates= dd;
                this.toAmount=this.fromRates.find((datas:any)=>datas.currency==this.to)?.amount;
                this.fromAmount=this.fromRates.find((datas:any)=>datas.currency==this.from)?.amount;
                this.toCurrenciesRates=this.fromRates.filter((x:any) => this.topCurrencies.includes(x.currency));
            // console.log(this.toCurrenciesRates);
            
              });

              this.getHistoricalData()
              
            })
        
          }
           

  back(){
    this.location.back();
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

  formatHistoricalData(data:any){

        //get all pure last days

        let datasets:any=[];
        console.log(this.from);
        console.log(this.to);
        [this.to,this.from].forEach((currency)=>{
          let dset:any={};
          dset.label=currency
          let arrayr:any=[];
          data.forEach((el:any)=>{
            el.rates.forEach((rate:any) => {
              if(currency==rate.currency){
                arrayr.push(rate.amount)
              }
            });
          })
          dset.data=arrayr.reverse()
          datasets.push(dset);
        })

        
        //prepare for graph
        let labels:any[]=[];
        this.historicalDays.forEach((e,i)=>{
           labels.push(new Date(e).toLocaleString('default', { month: 'long' }));
        })

        labels=labels.reverse()

        return {
          labels,
          datasets
        }
        
  }

  getHistoricalData(){

    this.currencyService.getGraphSubject().subscribe((data:any)=>{
      
      if(data!=0){
        this.graph_data=this.formatHistoricalData(data)
      }
      
    })
  }

  


  ngOnInit(): void {
    this.historicalDays=this.currencyService.getPreviousDays();

    // set to and from (route parameters)
     this.aroute.params.subscribe((data:any)=>{
      if(data.conversion){

        let to_from=data.conversion.split('-');
        this.from=to_from[0];
        this.to=to_from[1];
        this.from_data;

        this.getHistoricalData()
      }
     })     

    



    //  this.countries$= this.currencyService.getCurrency().pipe(
    //   shareReplay()
    // );

    this.currencyService.getSupportedSubject().subscribe((data:any)=>{
      if(data!=0){
        this.from_data=data.find((supported:any)=>supported.currency==this.from)
        this.supportedCurrencies=data;
      }
    })

    this.currencyService.getAmountSubject().subscribe((data)=>{
      if(data!=0){
        this.amount=data;
      }
      
    })

    this.currencyService.getConversionSubject().subscribe((data)=>{
      if(data!=0){
        // console.log(data);
      }
    })
    
    this.convert()
    
   
    this.lineChartData={
      datasets:this.graph_data?.datasets ,
      labels: this.graph_data?.labels 
    };
  
    this.lineChartOptions= {
      elements: {
        line: {
          tension: 0.5
        }
      },
      scales: {
        y:
          {
            position: 'left',
          },
      }
    };
  
    console.log(this.lineChartData)
 }

 ngAfterViewInit(): void {
 
 }
}
