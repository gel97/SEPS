import { Component, OnInit } from '@angular/core';
import { MessageService } from 'src/app/shared/Tools/message.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {

  constructor(private service: MessageService,private router: Router) { }
  SeenList: any = [];
  NotifList: any = [];
  totalNotif: any = [];

  data:any={};
  listMessage:any=[];
  unread:any={};
  userId:string="";

  ngOnInit(): void {
    this.GetListMessages();
  }

  GetListMessages(){
    this.service.GetListMessage().subscribe((response:any) => {
      this.listMessage = response.data;
      this.unread = response.unread;

      console.log(this.unread);
    });
  }

  GetUserId(userId:string, transId:string){
    this.service.SeenMessage(transId).subscribe((response:any) => {
      this.GetListMessages();
    });
    this.router.navigate(['Tools/message-list/', userId]);
    console.log(this.userId)
  }


}
