import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main-home',
  templateUrl: './main-home.component.html',
  styleUrls: ['./main-home.component.css']
})
export class MainHomeComponent implements OnInit {
  listofUser:any=[];

  constructor(private service: AuthService) { }

  ngOnInit(): void {
    this.service.getUsersList().subscribe(data => {
      this.listofUser = (<any>data);
      console.log(this.listofUser);
    });
  }

}
