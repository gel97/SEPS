import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/shared/Tools/message.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  constructor(private authService: AuthService, private service: MessageService,private router: Router) {
    this.currentUserId = this.authService.userId;
   }

  adminID:string = "U230601094336689";
  loading:boolean = true; 
  SeenList: any = [];
  NotifList: any = [];
  totalNotif: any = [];

  data:any={};
  listMessage:any=[];
  listResultMessage:any=[];
  listMyMessage:any={};
  unread:any={};
  userId:string="";

  countUnread:number = 0;

  send: any = {};
  toValidate: any = {};

  currentUserId:any;

  ngOnInit(): void {
    this.GetListMessages();
  }

  GetListMessages(){
    this.service.GetListMessage().subscribe({
      next:(response:any)=>{
      this.listMessage = response.data;
      this.unread = response.unread;

     // console.log("GetListMessages :", response);
      },
      error: ()=>{},
      complete:()=>{
        this.GetListMyMessages();
      }
    });
  }

  GetListMyMessages(){
    this.service.GetListMyMessage().subscribe({
      next:(response:any)=>{
         this.listMyMessage = response;
         //console.log("GetListMyMessages :", this.listMyMessage);
      },
      error: ()=>{},
      complete:()=>{
        this.FilterMessages();
      }
    });
  }

  FilterMessages(){
    if(this.listMessage.length > 0){
      this.listMessage?.forEach((a:any) => {
        let add:boolean = true;
        this.listMyMessage?.forEach((b:any) => {
          if(a.fromUserId == b.toUserId && a.toUserId == b.fromUserId){
            if(a.createdAt > b.createdAt){
              add = false;
              this.listResultMessage.push(a);
              if(a.seen === null){
                this.countUnread++;
              }
            }
            else{
              add = false;
              this.listResultMessage.push(b);
            }
          } 
        });
  
        if(add){
          this.listResultMessage.push(a);
          if(a.seen === null){
            this.countUnread++;
          }
        } 
      });
    }else{
      this.listResultMessage = this.listMyMessage;
    }
   

    this.loading= false;
   console.log("listResultMessage", this.listResultMessage);

  }

  GetUserId(userId:string, transId:string){
    this.service.SeenMessage(transId).subscribe((response:any) => {
      this.GetListMessages();
    });
    this.router.navigate(['Tools/message-list/', userId]);
    console.log(this.userId)
  }

  AddMessage() {
    this.toValidate.message =
      this.send.message == '' || this.send.message == undefined ? true : false;

    if (!this.toValidate.message) {
      this.send.toUserId = this.adminID; // add message to admin
      this.service.AddMessage(this.send).subscribe({
        next: (request) => {

          //this.GetListMessages(this.currentUserId);
          this.send.message="";

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
