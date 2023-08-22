import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/shared/Tools/message.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css'],
})
export class MessageListComponent implements OnInit {
  userFromId: any;
  userMeId: any;

  data: any = {};
  user: any = {};

  toValidate: any = {};

  constructor(private service: MessageService, private route: ActivatedRoute) {}
  listMessage: any = [];

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.toValidate.message = false;
      const id = params.get('id');
      console.log('Route parameter "id" changed:', id);
      this.GetListMessages(id);
    });
  }

  GetListMessages(userId: any) {
    this.service.GetListMessageData(userId).subscribe((response: any) => {
      this.listMessage = response.data;
      this.user = response.user;
      this.userFromId = response.userId;
      this.userMeId = response.userMeId;
      console.log(response);
    });
  }

  AddMessage() {
    this.toValidate.message =
      this.data.message == '' || this.data.message == undefined ? true : false;

    this.data.toUserId = this.userFromId;

    if (!this.toValidate.message) {
      this.service.AddMessage(this.data).subscribe({
        next: (request) => {

          this.GetListMessages(this.userFromId);
          this.data={};

          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });

          Toast.fire({
            icon: 'success',
            title: 'Message send successfully',
          });
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {},
      });
    }
  }
}
