import { DatePipe, Location } from '@angular/common';
import { Component ,OnInit,ViewChild} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { CurrencyService } from '../currency.service';
import { Chart, ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { default as Annotation } from 'chartjs-plugin-annotation';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit{
  private newLabel? = 'New label';
  amount?:number;
  to:string='USD';
  from:string='EUR';
  start_date?:string;
  end_date?:string;

  // $countries:Observable
  countries$=new Observable<any>;
  countries:any;
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
  
  constructor(
    private currencyService:CurrencyService, 
    private aroute:ActivatedRoute, 
    private location:Location,
    private datePipe:DatePipe
          ){
            Chart.register(Annotation)
          }

          public lineChartData: ChartConfiguration['data'] = {
            datasets: [
              {
                data: [ 65, 59, 80, 81, 56, 55, 40 ],
                label: 'usd',
                // backgroundColor: 'rgba(148,159,177,0.2)',
                // borderColor: 'rgba(148,159,177,1)',
                // pointBackgroundColor: 'rgba(148,159,177,1)',
                // pointBorderColor: '#fff',
                // pointHoverBackgroundColor: '#fff',
                // pointHoverBorderColor: 'rgba(148,159,177,0.8)',
                // fill: 'origin',
              },
              {
                data: [ 28, 48, 40, 19, 86, 27, 90 ],
                label: 'eur',
                // backgroundColor: 'rgba(77,83,96,0.2)',
                // borderColor: 'rgba(77,83,96,1)',
                // pointBackgroundColor: 'rgba(77,83,96,1)',
                // pointBorderColor: '#fff',
                // pointHoverBackgroundColor: '#fff',
                // pointHoverBorderColor: 'rgba(77,83,96,1)',
                // fill: 'origin',
              },
              {
                data: [ 180, 480, 770, 90, 1000, 270, 400 ],
                label: 'GBP',
                // yAxisID: 'y1',
                // backgroundColor: 'rgba(255,0,0,0.3)',
                // borderColor: 'red',
                // pointBackgroundColor: 'rgba(148,159,177,1)',
                // pointBorderColor: '#fff',
                // pointHoverBackgroundColor: '#fff',
                // pointHoverBorderColor: 'rgba(148,159,177,0.8)',
                // fill: 'origin',
              }
            ],
            labels: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July' ]
          };
        
          public lineChartOptions: ChartConfiguration['options'] = {
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
        
          public lineChartType: ChartType = 'line';
        
          @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
        

   swap(){
    let current_to=this.to;
    let current_from =this.from;
    this.to=current_from;
    this.from=current_to;
   }

   convert(){
     this.countries$.subscribe(data=>this.countries=data)
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

  formatHistoricalData(data:any){
        let rates=data.rates;
        let lastdays=[]
        // get all duplicate lastdays
        for(let rate in rates){
          //  console.log(rate);
           lastdays.push(this.getLastDay(rate))           
        }
        //get all pure last days
        let alllastdays=[...new Set(lastdays)]
        
        //prepare for graph
        let labels:any[]=[];
        let da:any[]=[];
        alllastdays.forEach((e,i)=>{
          // console.log(rates[e]);
           labels.push(new Date(e).toLocaleString('default', { month: 'long' }));
           dd.push()
          
        })
        console.log(labels);

        const month = new Date().toLocaleString('default', { month: 'long' });
        console.log(month)
        
  }


  ngOnInit(): void {

     this.aroute.params.subscribe((data:any)=>{
      if(data.conversion){

        let to_from=data.conversion.split('-');
        console.log(to_from)
        this.from=to_from[0];
        this.to=to_from[1];
      }
     })     

     this.getDates()

     this.countries$= this.currencyService.getCurrency().pipe(
      shareReplay()
    );

    this.formatHistoricalData(this.historicalData);
     
 }
}
