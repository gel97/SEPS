import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-activity-logs',
  templateUrl: './activity-logs.component.html',
  styleUrls: ['./activity-logs.component.css'],
})
export class ActivityLogsComponent implements OnInit, OnDestroy {
  selectedMonth: number | undefined;
  selectedYear: number | undefined;
  activityLogs: any = [];
  isAdmin: boolean = false;
  refreshSub: Subscription | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'Admin';

    if (this.isAdmin) {
      this.loadAllLogsForAdmin();

      // Auto-refresh every 10 seconds
      this.refreshSub = interval(10000).subscribe(() => {
        this.loadAllLogsForAdmin();
      });
    } else {
      this.loadActivityLogsFromLocalStorage();
    }
  }

  ngOnDestroy(): void {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

  loadAllLogsForAdmin() {
    this.authService.getAllActivityLogs().subscribe(
      (logs: any) => {
        this.activityLogs = logs;
      },
      (error) => {
        console.error('Error loading admin logs:', error);
      }
    );
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
      const params: any = {
        month: this.selectedMonth,
        year: this.selectedYear,
      };

      if (!this.isAdmin) {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          params.userId = storedUserId;
        }
      }

      this.authService.getAllLogs(params).subscribe(
        (logs) => {
          if (!logs || logs.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'No Activity Logs Found',
              text: 'No activity logs found for the specified month and year.',
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
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Filter',
        text: 'Please select both month and year before filtering logs.',
      });
    }
  }
}
