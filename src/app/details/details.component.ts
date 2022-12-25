import { DatePipe, Location } from '@angular/common';
import { Component ,OnInit,ViewChild,AfterViewInit} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, Observable, shareReplay, Subject } from 'rxjs';
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

          console.log(this.supportedCurencies);
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
            console.log(this.amount);
            this.$amount.next(this.amount!);
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
              this.fromRates=this.currencyService.getFromRate(data.rates,this.from);
              this.toAmount=this.fromRates.find((datas:any)=>datas.currency==this.to).amount;
              this.fromAmount=this.fromRates.find((datas:any)=>datas.currency==this.from).amount;
              this.toCurrenciesRates=this.fromRates.filter((x:any) => this.topCurrencies.includes(x.currency));
            })
        
          }
           

  back(){
    this.location.back();
  }

  getDates(){
    let end_date = new Date();
    this.end_date=this.datePipe.transform(end_date,'yyyy-MM-dd')!;
    end_date.setMonth(end_date.getMonth() - 12);
    this.start_date=this.datePipe.transform(end_date,'yyyy-MM-dd')!;
    this.getLastDay(this.start_date);
  }

  getLastDay(sdate:any){
    let date=new Date(sdate);
   var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth()+1, 0);
   let last_day=this.datePipe.transform(lastDayOfMonth,'yyyy-MM-dd')!;
   return last_day;
  }

  formatRates(rates:any){
    let rate_collection=[];
  for(let rate in rates){
    let a:any={};
     a.date=rate;
     let b:any=[];
     for(let m in rates[rate]){
      let g:any={}
      g.currency=m;
      g.amount=rates[rate][m];
      b.push(g)
     }
     a.rate=b
     rate_collection.push(a);
  }

  return rate_collection
  }

  formatHistoricalData(data:any){
        let rates=data.rates;
        let lastdays=[]

        // get dulicate value
        for(let day of this.formattedRates){
          lastdays.push(this.getLastDay(day.date)) 
        }

        //get all pure last days
        let alllastdays=[...new Set(lastdays)]

        let datasets:any=[];

        this.supportedCurencies.forEach((currency)=>{
          let dset:any={};
          dset.label=currency
          // let f=this.formatRates
          let arrayr:any=[];
          this.formattedRates.forEach((element:any) => {
              element.rate.forEach((e:any)=>{
                 if(currency==e.currency){
                   arrayr.push(e.amount)
                 }
              })
           });
           dset.data=arrayr;
           datasets.push(dset);
        })
        
        //prepare for graph
        let labels:any[]=[];
        alllastdays.forEach((e,i)=>{
           labels.push(new Date(e).toLocaleString('default', { month: 'long' }));
        })

        return {
          labels,
          datasets
        }
        
  }

  getHistoricalData(){

    let symbols=this.to+','+this.from;
    this.currencyService.getHistoricalData(this.start_date!,this.end_date!,symbols).subscribe((data)=>{
      console.log(data);
    })
  }

  


  ngOnInit(): void {
    this.getDates()
    // this.getSupportedCurrency();
    this.formattedRates= this.formatRates(this.historicalData.rates);
    this.graph_data=this.formatHistoricalData(this.historicalData);
    console.log(this.formattedRates)

    // set to and from (route parameters)
     this.aroute.params.subscribe((data:any)=>{
      if(data.conversion){

        let to_from=data.conversion.split('-');
        console.log(to_from)
        this.from=to_from[0];
        this.to=to_from[1];
        this.from_data;

        this.getHistoricalData()
      }
     })     

    



     this.countries$= this.currencyService.getCurrency().pipe(
      shareReplay()
    );

    this.currencyService.getSupportedSubject().subscribe((data:any)=>{
      if(data!=0){
        console.log(data);
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
        console.log(data);
      }
    })
    
    this.convert()
    
   
  
 }

 ngAfterViewInit(): void {
  this.lineChartData={
    datasets:this.graph_data.datasets ,
    labels: this.graph_data.labels 
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
    },

    // plugins: {
    //   legend: { display: true },
    //   annotation: {
    //     annotations: [
    //       {
    //         type: 'line',
    //         scaleID: 'x',
    //         value: 'March',
    //         borderColor: 'orange',
    //         borderWidth: 2,
    //         label: {
    //           display: true,
    //           position: 'center',
    //           color: 'orange',
    //           content: 'LineAnno',
    //           font: {
    //             weight: 'bold'
    //           }
    //         }
    //       },
    //     ],
    //   }
    // }
  };

  console.log(this.lineChartData)
 }
}
