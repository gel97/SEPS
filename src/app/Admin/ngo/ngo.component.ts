import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-ngo',
  templateUrl: './ngo.component.html',
  styleUrls: ['./ngo.component.css']
})
export class NgoComponent implements OnInit {

  constructor(private Auth:AuthService) { }
  designation:any = "";

  ngOnInit(): void {
    this.designation = this.Auth.designation;
  }

}
