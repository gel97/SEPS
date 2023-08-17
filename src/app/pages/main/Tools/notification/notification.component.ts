import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NewsService } from 'src/app/shared/Tools/news.service';
import { NotifSeenService } from 'src/app/shared/Tools/notif-seen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  constructor(private NotifSeenService: NotifSeenService, private NewsService: NewsService, private auth: AuthService) { }
  SeenList: any = [];
  NotifList: any = [];
  totalNotif: any = [];

  ngOnInit(): void {
    this.GetNotif();
  }

  GetNotif() {
    this.NewsService.GetNews().subscribe({
      next: (response) => {
        this.NotifList = (<any>response);
        
      },
      error: (error) => {

      },
      complete: () => {
        this.GetSeen();
      }
    })
  }

  GetSeen() {
    this.NotifSeenService.GetSeenNotif().subscribe({
      next: (response) => {
        this.SeenList = (<any>response);
      },
      error: (error) => {

      },
      complete: () => {
        this.filterNews();
      }
    })
  }

  IsSeen(data:any){
    this.NotifSeenService.SeenNotif(data).subscribe({
      next: (response) => {
        this.filterNews();
      },
      error: (error) => {
      },
      complete: () => {
        let indexToRemove = this.totalNotif.findIndex((obj:any) => obj.id === 3);
        this.totalNotif.splice(indexToRemove, 1);
      }
    })
  }
  result: any = [];
  filterNews() {
    let list;
    
    if (this.auth.o_munCityId) {
      list = this.NotifList.filter((a: any) => a.hidden == 0);
    }
    else {
      list = this.NotifList.filter((a: any) => a.hidden == 0 && a.isAdmin == 0);
    }

    list.forEach((item: any) => {
      this.SeenList.forEach((seen: any) => {
        if (item.transId == seen.notificationId) {
          this.result.push({
            'transId': item.transId,
            'title': item.title,
            'datePosted': item.datePosted,
            'seen': true
          })
        } 

      });

      let isExist = this.result.filter((a: any) => a.transId == item.transId);
      if (isExist.length == 0) {
        this.totalNotif.push(item);
        this.result.push({
          'transId': item.transId,
          'title': item.title,
          'datePosted': item.datePosted,
          'seen': false
        })
      }
    });


  }
}
