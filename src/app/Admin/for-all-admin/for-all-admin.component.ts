import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-for-all-admin',
  templateUrl: './for-all-admin.component.html',
  styleUrls: ['./for-all-admin.component.css']
})
export class ForAllAdminComponent implements OnInit {

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
