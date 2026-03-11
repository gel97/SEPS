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
  selectedMonth?: number;
  selectedYear?: number;
  activityLogs: any[] = [];
  isAdmin = false;
  refreshSub?: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'Admin';

    this.loadLogs();

    // auto refresh every 10 seconds
    this.refreshSub = interval(10000).subscribe(() => {
      this.loadLogs();
    });
  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  loadLogs() {
    const userId = localStorage.getItem('userId');

    const params: any = {
      Take: 100,
    };

    // kung dili admin, own logs ra
    if (!this.isAdmin && userId) {
      params.userId = userId;
    }

    this.authService.getAllLogs(params).subscribe(
      (logs: any[]) => {
        this.activityLogs = logs;
      },
      (error) => {
        console.error('Error loading logs:', error);
      }
    );
  }

  filterLogs() {
    if (!this.selectedMonth || !this.selectedYear) {
      Swal.fire('Please select both month and year', '', 'warning');
      return;
    }

    const userId = localStorage.getItem('userId');

    const params: any = {
      month: this.selectedMonth,
      year: this.selectedYear,
      Take: 100,
    };

    if (!this.isAdmin && userId) {
      params.userId = userId;
    }

    this.authService.getAllLogs(params).subscribe(
      (logs: any[]) => {
        if (!logs.length) {
          Swal.fire('No logs found', '', 'info');
        }
        this.activityLogs = logs;
      },
      (error) => {
        console.error('Error filtering logs:', error);
      }
    );
  }

  // clearLogs() {
  //   const userId = localStorage.getItem('userId');

  //   this.authService.clearActivityLogs(userId).subscribe(() => {
  //     this.activityLogs = [];
  //     Swal.fire('Logs cleared successfully!', '', 'success');
  //   });
  // }
}
