import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterDate',
})
export class FilterDatePipe implements PipeTransform {
  transform(logs: any[], selectedMonth: number, selectedYear: number): any[] {
    if (!logs || !selectedMonth || !selectedYear) {
      return logs;
    }
    return logs.filter((log) => {
      const logDate = new Date(log.loginTime);
      return (
        logDate.getMonth() + 1 === selectedMonth &&
        logDate.getFullYear() === selectedYear
      );
    });
  }
}
