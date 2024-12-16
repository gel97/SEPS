import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-nga',
  templateUrl: './nga.component.html',
  styleUrls: ['./nga.component.css'],
})
export class NGAComponent implements OnInit {
  constructor(private Auth: AuthService, private router: Router) {}
  o_munCityId: any = '';
  munCityId: any = '';
  activeSetYear: any = '';
  setYear: any = '';
  ngOnInit(): void {
    this.o_munCityId = this.Auth.o_munCityId;
    this.munCityId = this.Auth.munCityId;
    this.activeSetYear = this.Auth.activeSetYear;
    this.setYear = this.Auth.setYear;
  }
  goToDashboard() {
    this.router.navigate(['/dashboard']); // Change '/dashboard' if your route is different
  }
}