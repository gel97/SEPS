import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-for-guest-only',
  templateUrl: './for-guest-only.component.html',
  styleUrls: ['./for-guest-only.component.css'],
})
export class ForGuestOnlyComponent implements OnInit {
  constructor(private Auth: AuthService) {}
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
}
