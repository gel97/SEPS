import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private Auth:AuthService) { }
  o_munCityId:any = "";
  munCityId:any = "";
  activeSetYear:any = "";
  setYear:any = "";

  ngOnInit(): void {
    this.o_munCityId = this.Auth.o_munCityId;
    this.munCityId = this.Auth.munCityId;
    this.activeSetYear = this.Auth.activeSetYear;
    this.setYear = this.Auth.setYear

  }


}
