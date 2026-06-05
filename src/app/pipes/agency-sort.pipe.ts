import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'agencySort',
  standalone: true
})
export class AgencySortPipe implements PipeTransform {

  transform(items: any[]): any[] {
    if (!items || items.length <= 1) {
      return items;
    }

    return items.sort((a, b) => a.shortName.localeCompare(b.shortName));
  }


}