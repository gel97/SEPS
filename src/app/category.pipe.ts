import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'category'
})
export class CategoryPipe implements PipeTransform {
  
  transform(items: any[], column: string, searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    searchText = searchText.toLowerCase();
    return items.filter(item => {
      return item[column].toLowerCase().includes(searchText);
    });
  }
  // category =[
  //   {category: '1', text: 'Elective'},
  //   {category: '2', text: 'Appointed'}
  // ];

}
