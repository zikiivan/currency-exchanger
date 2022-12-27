import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rates'
})
export class RatesPipe implements PipeTransform {

  transform(rates: any[],from:any): any {
    
    return rates.find((data)=>data.currency=from);
  }

}
