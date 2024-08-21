import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/Tools/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css'],
})
export class UpdateUserComponent implements OnInit {
  constructor(private service: UserService) {}

  ngOnInit(): void {
    this.Init();
  }
  list_muncity: any = {};
  searchText = '';
  listData: any = [];

  Init() {
    this.GetUser();
  }
  GetUser() {
    this.service.GetUser().subscribe((data) => {
      this.listData = <any>data;
      console.log(this.listData);
    });
  }
}
