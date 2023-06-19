import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ddn',
  templateUrl: './ddn.component.html',
  styleUrls: ['./ddn.component.css']
})
export class DdnComponent implements OnInit {

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
