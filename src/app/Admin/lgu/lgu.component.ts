import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-lgu',
  templateUrl: './lgu.component.html',
  styleUrls: ['./lgu.component.css']
})
export class LGUComponent implements OnInit {

  constructor(private Auth:AuthService) { }
  o_munCityId:any = "";
  munCityId:any = "";
  activeSetYear:any = "";
  setYear:any = "";
  designation:any = "";
  ngOnInit(): void {
    this.o_munCityId = this.Auth.o_munCityId;
    this.munCityId = this.Auth.munCityId;
    this.activeSetYear = this.Auth.activeSetYear;
    this.setYear = this.Auth.setYear
    this.designation = this.Auth.designation;


  }

}
