import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/Tools/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  constructor(private service: UserService) { }

  ngOnInit(): void {
    this.service.ListMunCity().subscribe(data=>{
      this.list_muncity =(<any>data);
    })
  }
  list_muncity:any = {};
}
