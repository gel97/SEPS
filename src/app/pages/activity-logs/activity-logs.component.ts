import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-activity-logs',
  templateUrl: './activity-logs.component.html',
  styleUrls: ['./activity-logs.component.css'],
})
export class ActivityLogsComponent implements OnInit {
  selectedMonth: number | undefined;
  selectedYear: number | undefined;
  activityLogs: any = [];
  searchText: string | undefined;
  tableSize: string | number | undefined;
  p: string | number | undefined;
  count: string | number | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadActivityLogsFromLocalStorage();
  }
  loadActivityLogsFromLocalStorage() {
    const logs = JSON.parse(localStorage.getItem('activityLogs') || '[]');
    this.activityLogs = logs;
  }

  clearLogs() {
    this.authService.clearActivityLogs();
    this.activityLogs = [];
    Swal.fire('Logs cleared successfully!', '', 'success');
  }
  filterLogs() {
    if (this.selectedMonth && this.selectedYear) {
      this.authService
        .getActivityLogsByMonth(this.selectedMonth, this.selectedYear)
        .subscribe(
          (logs) => {
            if (logs.length === 0) {
              // Show SweetAlert if no logs are found
              Swal.fire({
                icon: 'info',
                title: 'No Activity Logs Found',
                text: 'No activity logs found for the specified month and year.',
                confirmButtonText: 'OK',
              });
            } else {
              this.activityLogs = logs;
              localStorage.setItem('activityLogs', JSON.stringify(logs));
            }
          },
          (error) => {
            console.error('Error fetching activity logs:', error);
          }
        );
    } else {
      console.warn('Please select both month and year before filtering logs.');
    }
  }
}
