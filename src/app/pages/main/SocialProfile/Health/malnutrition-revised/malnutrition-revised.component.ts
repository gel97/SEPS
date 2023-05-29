import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HealthMalnutritionService } from 'src/app/shared/SocialProfile/Health/healthMalnutrition.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';

@Component({
  selector: 'app-malnutrition-revised',
  templateUrl: './malnutrition-revised.component.html',
  styleUrls: ['./malnutrition-revised.component.css'],
})
export class MalnutritionRevisedComponent implements OnInit {
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  constructor(
    private auth: AuthService,
    private service: HealthMalnutritionService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  munCityName: string = this.auth.munCityName;
  listHealthMalnut: any = [];
  listBarangay: any = [];

  isAdd: boolean = false;
  listData: any = [];
  data: any = {};

  ngOnInit(): void {
    this.Init();
  }

  Init() {
    this.GetHealthMalnutrition();
    this.GetListBarangay();
  }

  GetHealthMalnutrition() {
    this.service
      .GetHealthMalnutrition(this.auth.setYear, this.auth.munCityId)
      .subscribe({
        next: (response) => {
          this.listHealthMalnut = <any>response;
          console.log(this.listHealthMalnut);
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
      this.listHealthMalnut.forEach((b: any) => {
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
      this.service.AddHealthMalnutrition(this.data).subscribe({
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
    this.service.EditHealthMalnutrition(this.data).subscribe({
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
        this.service.DeleteHealthMalnutrition(transId).subscribe({
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
