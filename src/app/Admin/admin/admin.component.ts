import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private Auth:AuthService) { }

  munCityId:any = "";

  ngOnInit(): void {
    this.munCityId = this.Auth.o_munCityId;
    console.log("ADMIN: ", this.munCityId);
  }

}
