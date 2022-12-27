import { Component, Input ,AfterViewInit,OnInit, ViewChild, OnChanges, SimpleChange, SimpleChanges} from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.css']
})
export class HistoricalComponent implements OnInit,AfterViewInit,OnChanges {
  @Input('data') data?:any;
  public lineChartData?: ChartConfiguration['data'];
        
          public lineChartOptions?: ChartConfiguration['options'];
        
          public lineChartType: ChartType = 'line';
        
          @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnInit(){
    this.lineChartData={
      datasets:this.data?.datasets ,
      labels: this.data?.labels 
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
  }
  ngAfterViewInit(){}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['data'].currentValue?.datasets)
    this.lineChartData={
      datasets:changes['data'].currentValue?.datasets ,
      labels: changes['data'].currentValue?.labels 
    };
}

}
