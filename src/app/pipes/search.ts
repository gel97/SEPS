import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    if (!value) {
      console.log("null");
      return null;
    }
    if (!args) {
      console.log("value: " + args);
      return value;
    }

    args = args.toLowerCase();
    return value.filter(function(item: any){
      return JSON.stringify(item).toLowerCase().includes(args);
    });
  }

}
