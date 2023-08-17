import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'hoursAgoOrDate'
})
export class HoursAgoOrDatePipe implements PipeTransform {

  transform(value: any): string {
    if (!value) return '';
  
    const currentDate = new Date();
    const previousDate = new Date(value);
  
    const hoursElapsed = Math.floor((currentDate.getTime() - previousDate.getTime()) / 3600000);
  
    if (hoursElapsed < 1) {
      return 'Less than an hour ago';
    } else if (hoursElapsed < 24) {
      if(hoursElapsed == 1){
        return `${hoursElapsed} hour ago`;
      }
      return `${hoursElapsed} hours ago`;
    } else {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return previousDate.toDateString();    }
  }

}
