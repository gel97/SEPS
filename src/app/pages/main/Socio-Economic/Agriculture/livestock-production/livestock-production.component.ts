import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HealthHandicapService } from 'src/app/shared/SocialProfile/Health/healthHandicap.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { AgricultureLivestockService } from 'src/app/shared/Socio-Economic/Agriculture/agricultureLivestock.service';
@Component({
  selector: 'app-livestock-production',
  templateUrl: './livestock-production.component.html',
  styleUrls: ['./livestock-production.component.css'],
})
export class LivestockProductionComponent implements OnInit {
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  constructor(
    private auth: AuthService,
    private service: AgricultureLivestockService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  munCityName: string = this.auth.munCityName;
  listLivestock: any = [];
  listBarangay: any = [];
  isAdd: boolean = false;
  listData: any = [];
  data: any = {};
  ngOnInit(): void {
    this.Init();
  }

  Init() {
    this.GetData();
    this.GetListBarangay();
  }
  message = 'Livestock/ Poultry Production';
  viewData: boolean = false;
  parentMethod() {
    this.viewData = true;
  }
  public showOverlay = false;
  importMethod() {
    // this.showOverlay = true;
    // this.service.Import().subscribe({
    //   next: (data) => {
    //     this.Init();
    //     if(data.length === 0){
    //       this.showOverlay = false;
    //       const Toast = Swal.mixin({
    //         toast: true,
    //         position: 'top-end',
    //         showConfirmButton: false,
    //         timer: 3000,
    //         timerProgressBar: true,
    //         didOpen: (toast) => {
    //           toast.addEventListener('mouseenter', Swal.stopTimer);
    //           toast.addEventListener('mouseleave', Swal.resumeTimer);
    //         },
    //       });
  
    //       Toast.fire({
    //         icon: 'info',
    //         title: 'No data from previous year',
    //       });
    //     }
    //     else
    //     {
    //       this.showOverlay = false;
    //       const Toast = Swal.mixin({
    //         toast: true,
    //         position: 'top-end',
    //         showConfirmButton: false,
    //         timer: 3000,
    //         timerProgressBar: true,
    //         didOpen: (toast) => {
    //           toast.addEventListener('mouseenter', Swal.stopTimer);
    //           toast.addEventListener('mouseleave', Swal.resumeTimer);
    //         },
    //       });
  
    //       Toast.fire({
    //         icon: 'success',
    //         title: 'Imported Successfully',
    //       });
    //     }
    //   },
    //   error: (error) => {
    //     const Toast = Swal.mixin({
    //       toast: true,
    //       position: 'top-end',
    //       showConfirmButton: false,
    //       timer: 3000,
    //       timerProgressBar: true,
    //       didOpen: (toast) => {
    //         toast.addEventListener('mouseenter', Swal.stopTimer);
    //         toast.addEventListener('mouseleave', Swal.resumeTimer);
    //       },
    //     });

    //     Toast.fire({
    //       icon: 'warning',
    //       title: 'Something went wrong',
    //     });
    //   },
    //   complete: () => {},
    // });
  }
  GetData() {
    this.service
      .GetListAgricultureLivestock(this.auth.setYear, this.auth.munCityId)
      .subscribe({
        next: (response) => {
          this.listLivestock = <any>response;
        },
        error: (error) => {},
        complete: () => {
          this.GetListBarangay();
        },
      });
  }

  GetListBarangay() {
    this.service.ListOfBarangay(this.auth.munCityId).subscribe({
      next: (response) => {
        this.listBarangay = <any>response;
      },
      error: (error) => {},
      complete: () => {
        this.FilterList();
      },
    });
  }

  FilterList() {
    let isExist;
    this.listData = [];

    this.listBarangay.forEach((a: any) => {
      this.listLivestock.forEach((b: any) => {
        if (a.brgyId == b.brgyId) {
          isExist = this.listData.filter((x: any) => x.brgyId == a.brgyId);
          if (isExist.length == 0) {
            this.listData.push(b);
          }
        }
      });

      isExist = this.listData.filter((x: any) => x.brgyId == a.brgyId);
      if (isExist.length == 0) {
        this.listData.push({
          brgyId: a.brgyId,
          brgyName: a.brgyName,
        });
      }
    });
  }

  AddData() {
    if (isEmptyObject(this.data)) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;
      this.service.AddAgricultureLivestock(this.data).subscribe({
        next: (request) => {
          let index = this.listData.findIndex(
            (obj: any) => obj.brgyId === this.data.brgyId
          );
          this.listData[index] = request;
        },
        complete: () => {
          this.data = {};
          this.closebutton.nativeElement.click();

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1000,
          });
        },
      });
    }
  }

  EditData() {
    this.data.setYear = this.auth.activeSetYear;
    this.service.EditAgricultureLivestock(this.data).subscribe({
      next: (request) => {
        this.closebutton.nativeElement.click();
        this.data = {};
      },
      complete: () => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been updated',
          showConfirmButton: false,
          timer: 1000,
        });
      },
    });
  }

  DeleteData(transId: any, index: any, data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.DeleteAgricultureLivestock(transId).subscribe({
          next: (_data) => {},
          error: (err) => {
            Swal.fire('Oops!', 'Something went wrong.', 'error');
          },
          complete: () => {
            this.listData[index] = {};
            this.listData[index].brgyId = data.brgyId;
            this.listData[index].brgyName = data.brgyName;
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
        });
      }
    });
  }
}
